#!/usr/bin/env python3
"""Preview locally; explicit --apply creates missing GitHub issues and metadata.

Requires Python 3.10+. Apply also requires authenticated GitHub CLI access.
Never deletes/overwrites remote issues, publishes code or retries uncertain POSTs.
Run one importer at a time. The repository and committed docs prefix are explicit.
"""
from __future__ import annotations
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path, PurePosixPath
from typing import Any
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
MARKER = re.compile(r'<!-- robo-paths:(RP-\d{3}) -->')
LINK = re.compile(r'(?<!!)\[([^\]]+)\]\(([^)\s]+)\)')


def topological(tasks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_id = {t['id']: t for t in tasks}
    if len(by_id) != len(tasks):
        raise ValueError('Duplicate task ID')
    result, active, done = [], set(), set()
    def visit(key: str) -> None:
        if key in active:
            raise ValueError(f'Dependency cycle at {key}')
        if key in done:
            return
        if key not in by_id:
            raise ValueError(f'Unknown dependency {key}')
        active.add(key)
        for dep in by_id[key]['dependencies']:
            visit(dep)
        active.remove(key)
        done.add(key)
        result.append(by_id[key])
    for task in tasks:
        visit(task['id'])
    return result


def absolute_doc_links(body: str, issue_path: Path, repo: str, ref: str, prefix: str) -> str:
    def replace(match: re.Match[str]) -> str:
        label, target = match.groups()
        if target.startswith(('http:', 'https:', 'mailto:', '#')):
            return match.group(0)
        path_text, sep, anchor = target.partition('#')
        resolved = (issue_path.parent / path_text).resolve()
        relative = resolved.relative_to(ROOT).as_posix()
        if not resolved.is_file():
            raise ValueError(f'Missing local document: {target}')
        remote_path = '/'.join(filter(None, [prefix.strip('/'), relative]))
        url = f'https://github.com/{repo}/blob/{quote(ref, safe="")}/{quote(remote_path, safe="/")}'
        if sep:
            url += '#' + quote(anchor, safe='-')
        return f'[{label}]({url})'
    return LINK.sub(replace, body)


def run_gh(args: list[str], payload: dict[str, Any] | None = None) -> Any:
    command = ['gh', *args]
    if payload is not None:
        command += ['--input', '-']
    try:
        completed = subprocess.run(command, input=None if payload is None else json.dumps(payload),
            text=True, capture_output=True, check=True, timeout=60)
    except FileNotFoundError as exc:
        raise RuntimeError('GitHub CLI not found. Install/authenticate gh before --apply.') from exc
    except subprocess.CalledProcessError as exc:
        raise RuntimeError(f'gh failed: {exc.stderr.strip()}') from exc
    text = completed.stdout.strip()
    return json.loads(text) if text else None


def pages(path: str) -> list[dict[str, Any]]:
    command = ['gh', 'api', '--paginate', path]
    completed = subprocess.run(command, text=True, capture_output=True, check=True, timeout=60)
    text = completed.stdout.strip()
    if not text:
        return []
    decoder = json.JSONDecoder()
    pos = 0
    items: list[dict[str, Any]] = []
    while pos < len(text):
        while pos < len(text) and text[pos].isspace():
            pos += 1
        if pos >= len(text):
            break
        obj, end = decoder.raw_decode(text, pos)
        if isinstance(obj, list):
            items.extend(obj)
        elif isinstance(obj, dict):
            items.append(obj)
        pos = end
    return items


def index_existing(issues: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    found = {}
    for issue in issues:
        if 'pull_request' in issue:
            continue
        markers = MARKER.findall(issue.get('body') or '')
        if not markers and re.match(r'^\[RP-\d{3}\]', issue.get('title', '')):
            raise ValueError(f"Ambiguous existing issue #{issue['number']} has an RP title but no stable marker")
        for key in markers:
            if key in found:
                raise ValueError(f'Duplicate remote stable marker {key}; resolve manually')
            found[key] = issue
    return found


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', required=True, help='Existing OWNER/REPO')
    parser.add_argument('--ref', default='main', help='Committed documentation ref')
    parser.add_argument('--docs-prefix', default='', help='Kit root path inside repository')
    parser.add_argument('--milestone', choices=[f'M{i}' for i in range(6)])
    parser.add_argument('--include-optional', action='store_true')
    parser.add_argument('--apply', action='store_true', help='Allow remote creation of issues/labels/milestones')
    args = parser.parse_args(argv)
    if not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', args.repo):
        parser.error('--repo must be OWNER/REPO, not a URL')
    prefix = args.docs_prefix.strip('/')
    if '..' in PurePosixPath(prefix).parts or '\\' in prefix:
        parser.error('--docs-prefix must be a safe repository-relative POSIX path')
    if args.milestone == 'M5' and not args.include_optional:
        parser.error('M5 requires --include-optional')
    data = json.loads((ROOT / 'backlog/tasks.json').read_text())
    ordered = topological(data['tasks'])
    selected = [t for t in ordered if (args.include_optional or not t['optional'])
                and (not args.milestone or t['milestone'] == args.milestone)]
    prepared = {}
    for task in selected:
        path = ROOT / task['file']
        prepared[task['id']] = absolute_doc_links(path.read_text(), path, args.repo, args.ref, prefix)
        print(f"{'APPLY' if args.apply else 'PREVIEW'} {task['id']} {task['milestone']} {task['title']}")
    if not args.apply:
        print(f'\n{len(selected)} planned issues. No network calls or writes performed. Existing remote issues not inspected.')
        return 0
    # All local inputs and links have been validated before any remote write.
    repo_path = f'repos/{args.repo}'
    metadata = run_gh(['api', repo_path])
    if metadata['full_name'].lower() != args.repo.lower():
        raise ValueError('Repository identity did not match the requested target')
    existing = index_existing(pages(repo_path + '/issues?state=all&per_page=100'))
    labels = {l['name'] for l in pages(repo_path + '/labels?per_page=100')}
    milestones = {m['title']: m for m in pages(repo_path + '/milestones?state=all&per_page=100')}
    milestone_numbers = {}
    for m in data['milestones']:
        if not any(t['milestone'] == m['id'] for t in selected):
            continue
        if m['title'] not in milestones:
            milestones[m['title']] = run_gh(['api', '-X', 'POST', repo_path + '/milestones'], {'title': m['title'], 'description': m['gate']})
        milestone_numbers[m['id']] = milestones[m['title']]['number']
    out = {key: {'number': value['number'], 'url': value['html_url']} for key, value in existing.items()}
    report = ROOT / 'qa/github-issue-map.json'
    for task in selected:
        key = task['id']
        if key in existing:
            print(f"SKIP {key}: existing #{existing[key]['number']}; human body unchanged")
            continue
        needed_labels = ['robo-paths', 'priority:' + task['priority'].lower(), 'area:' + task['area']]
        if task['optional']:
            needed_labels.append('scope:optional')
        if task['human_gate']:
            needed_labels.append('gate:human')
        for label in needed_labels:
            if label not in labels:
                run_gh(['api', '-X', 'POST', repo_path + '/labels'], {'name': label, 'color': '246FE5', 'description': 'Robo Paths implementation planning'})
                labels.add(label)
        dependencies = [f"- {dep}: #{existing[dep]['number']}" if dep in existing else f'- {dep}: not imported in this selection' for dep in task['dependencies']]
        body = prepared[key] + '\n\n## Linked dependencies\n\n' + ('\n'.join(dependencies) or 'None.') + '\n'
        created = run_gh(['api', '-X', 'POST', repo_path + '/issues'],
            {'title': f"[{key}] {task['title']}", 'body': body, 'labels': needed_labels, 'milestone': milestone_numbers[task['milestone']]})
        existing[key] = created
        out[key] = {'number': created['number'], 'url': created['html_url']}
        report.parent.mkdir(parents=True, exist_ok=True)
        temp = report.with_suffix('.tmp')
        temp.write_text(json.dumps({'repo': args.repo, 'issues': out}, indent=2) + '\n')
        temp.replace(report)
        print(f"CREATED {key}: {created['html_url']}")
    print('Import finished. Existing bodies were not overwritten. Review returned issue links.')
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (ValueError, RuntimeError, OSError, subprocess.TimeoutExpired) as error:
        print(f'ERROR: {error}. Stopped; inspect remote state before rerunning.', file=sys.stderr)
        raise SystemExit(1)
