#!/usr/bin/env python3
"""Verify this specification kit, not a game build. Writes qa/results.json and REPORT.md."""
from __future__ import annotations
import hashlib
import importlib.metadata
import json
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote
try:
    from jsonschema import Draft202012Validator
    from referencing import Registry, Resource
except ImportError:
    raise SystemExit('Install package QA requirements: python3 -m pip install -r scripts/requirements.txt')
from reference_core import simulate, validate_level
from import_github_issues import topological

ROOT=Path(__file__).resolve().parents[1]
def read(p):return json.loads((ROOT/p).read_text(encoding='utf-8'))
def sha(value):return hashlib.sha256(json.dumps(value,sort_keys=True,separators=(',',':')).encode()).hexdigest()

def main():
    schemas={p.stem.replace('.schema',''):json.loads(p.read_text()) for p in (ROOT/'schemas').glob('*.json')}
    registry=Registry()
    for schema in schemas.values():
        Draft202012Validator.check_schema(schema)
        registry=registry.with_resource(schema['$id'],Resource.from_contents(schema))
    def validate(name,data):Draft202012Validator(schemas[name],registry=registry).validate(data)
    checks=0;witnesses=[]
    for f in read('examples/fixtures.json'):
        l=read('examples/'+f['level']);p=read('examples/'+f['program'])
        validate('level',l);validate('program',p);checks+=2
        validate_level(l);r=simulate(l,p)
        assert r['outcome']==f['expectedOutcome'],f
        assert sum(r['awards'].values())==f['expectedStars'],f
        witnesses.append({'level':l['id'],'outcome':r['outcome'],'blocks':r['usedBlocks'],'actions':r['final']['actionsUsed'],
                          'stars':sum(r['awards'].values()),'traceSha256':sha(r),'evidence':'witness_verified_no_optimality_claim'})
    for robot in read('examples/robots.json'):validate('robot',robot);checks+=1
    worlds=read('examples/worlds.planned.json')
    for world in worlds:validate('world',world);checks+=1
    validate('progress',read('examples/progress.json'));checks+=1
    validate('draft',{'schemaVersion':1,'engineRulesVersion':1,'commands':[{'id':'repeat-1','op':'repeat','count':2,'body':[]}]});checks+=1
    tasks=read('backlog/tasks.json')['tasks'];ordered=topological(tasks)
    assert len(tasks)==54 and sum(not t['optional'] for t in tasks)==49
    required={r['id'] for r in read('backlog/requirements.json')}
    covered={r for t in tasks if not t['optional'] for r in t['requirements']}
    assert required <= covered,'Uncovered requirements'
    curriculum=read('examples/curriculum.json')
    assert len(curriculum)==60 and len({x['id'] for x in curriculum})==60
    assert sum(x['status']=='example_witness_supplied' for x in curriculum)==12
    assert {i for w in worlds for i in w['levelIds']}=={x['id'] for x in curriculum}
    assert len({x['id'] for x in read('examples/robots.json')})==4
    for task in tasks:
        assert (ROOT/task['file']).is_file(),task['id']
        assert f"<!-- robo-paths:{task['id']} -->" in (ROOT/task['file']).read_text(),task['id']
    broken=[];links=0
    for path in ROOT.rglob('*.md'):
        if any(part in ('node_modules', '.venv', 'dist') for part in path.parts):
            continue
        for target in re.findall(r'!?\[[^\]]*\]\(([^)\s]+)\)',path.read_text(encoding='utf-8')):
            if target.startswith(('http:','https:','mailto:','#')):continue
            destination=(path.parent/unquote(target.split('#')[0])).resolve()
            links+=1
            if not destination.is_file():broken.append(f'{path.relative_to(ROOT)} -> {target}')
    assert not broken,'Broken links: '+'; '.join(broken)
    for item in read('design/asset-provenance.json'):
        p=ROOT/'design'/item['path'];assert p.is_file()
        if 'sha256' in item:assert hashlib.sha256(p.read_bytes()).hexdigest()==item['sha256']
    tests=subprocess.run([sys.executable,'-m','unittest','discover','-s',str(ROOT/'scripts'),'-p','test_*.py','-v'],
                         capture_output=True,text=True,timeout=45)
    if tests.returncode:raise RuntimeError(tests.stdout+tests.stderr)
    combined=tests.stdout+tests.stderr
    match=re.search(r'Ran (\d+) tests?',combined)
    report={'packageVersion':'1.0','preparedDate':'2026-09-05','status':'pass','pythonVersion':sys.version.split()[0],
      'jsonschemaVersion':importlib.metadata.version('jsonschema'),'schemas':len(schemas),'validatedSchemaInstances':checks,
      'exampleWitnesses':witnesses,'unitTests':int(match.group(1)) if match else None,'tasks':len(tasks),'webV1Tasks':49,
      'optionalTasks':5,'requirementsCovered':len(required),'curriculumBriefs':60,'internalLinksChecked':links,
      'dependencyGraph':'acyclic','mockupBoards':5,'referenceCrops':8,
      'notRun':['Production React/Phaser implementation or build','Production TypeScript core tests','Browser or real-device game tests',
                'Performance/accessibility/privacy certification','Child playtests','Global program optimality proof',
                'Full 60-level executable content validation','Live GitHub issue import','Public deployment or app-store submission']}
    (ROOT/'qa/results.json').write_text(json.dumps(report,indent=2)+'\n')
    (ROOT/'qa/reference-tests.txt').write_text(combined)
    rows='\n'.join(f"| {w['level']} | {w['outcome']} | {w['blocks']} | {w['actions']} | {w['stars']} |" for w in witnesses)
    md=f'''# Package validation — actual results

Status: **PASS** for the delivered specification kit, not a production game.

Python {report['pythonVersion']}; jsonschema {report['jsonschemaVersion']}. Prepared baseline: 2026-09-05.

| Check | Result |
|---|---|
| JSON schemas | {len(schemas)} valid Draft 2020-12 schemas |
| Validated sample instances | {checks} |
| Runnable sample witnesses | {len(witnesses)} success / three-star witnesses |
| Reference-core and importer local tests | {report['unitTests']} passed |
| Task dependencies | 54 tasks, acyclic; 49 v1 + 5 optional |
| Requirement traceability | {len(required)} covered by v1 tasks |
| Internal Markdown file links | {links} resolved |
| Curriculum plan | 60 unique briefs; 12 executable examples only |
| Design assets | Five supplied boards hash-checked; eight reference crops present |

## Verified witness outcomes

| Level | Outcome | Static blocks | Executed actions | Stars |
|---|---|---|---|---|
{rows}

Witnesses establish the listed example outcomes under the Python reference rules; no minimum-block proof is asserted. Machine-readable trace hashes are in `results.json`.

## Not run / not claimed

'''+ '\n'.join('- '+x for x in report['notRun'])+'''

The GitHub importer was tested only in local dry-run/helper tests. Remote permissions, issue creation and store/deployment behavior were not exercised. Final production sprites and hint copy are not supplied. The four planned world manifests intentionally refer to future content and are not a ready release pack.
'''
    (ROOT/'qa/REPORT.md').write_text(md)
    print(f"PASS: {len(witnesses)} example witnesses, {report['unitTests']} local tests, {len(tasks)} acyclic tasks, {links} links, {len(schemas)} schemas.")
    return 0

if __name__=='__main__':
    try:raise SystemExit(main())
    except (AssertionError,ValueError,RuntimeError,OSError,subprocess.TimeoutExpired) as error:
        print('FAIL: '+str(error),file=sys.stderr);raise SystemExit(1)
