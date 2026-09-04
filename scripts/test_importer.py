from pathlib import Path
import json
import subprocess
import sys
import unittest
from import_github_issues import ROOT, topological, absolute_doc_links, index_existing

class ImporterTests(unittest.TestCase):
    def test_dag_order(self):
        data=json.loads((ROOT/'backlog/tasks.json').read_text())
        ordered=topological(data['tasks']);pos={t['id']:i for i,t in enumerate(ordered)}
        self.assertEqual(len(ordered),54)
        for task in ordered:
            for dep in task['dependencies']:self.assertLess(pos[dep],pos[task['id']])
    def test_cycle_rejected(self):
        with self.assertRaisesRegex(ValueError,'cycle'):topological([{'id':'a','dependencies':['b']},{'id':'b','dependencies':['a']}])
    def test_unknown_dependency(self):
        with self.assertRaisesRegex(ValueError,'Unknown'):topological([{'id':'a','dependencies':['b']}])
    def test_document_rewrite(self):
        value=absolute_doc_links('[PRD](../../PRD.md)',ROOT/'backlog/issues/RP-001.md','owner/repo','main','planning/robo-paths')
        self.assertEqual(value,'[PRD](https://github.com/owner/repo/blob/main/planning/robo-paths/PRD.md)')
        self.assertNotIn(']](',value)
    def test_remote_links_unchanged(self):
        value='[Example](https://example.com/x)'
        self.assertEqual(absolute_doc_links(value,ROOT/'backlog/issues/RP-001.md','o/r','main',''),value)
    def test_existing_marker_skip_index(self):
        data=[{'number':3,'body':'<!-- robo-paths:RP-001 -->','title':'anything'}]
        self.assertEqual(index_existing(data)['RP-001']['number'],3)
    def test_duplicate_markers_rejected(self):
        data=[{'number':3,'body':'<!-- robo-paths:RP-001 -->'},{'number':4,'body':'<!-- robo-paths:RP-001 -->'}]
        with self.assertRaisesRegex(ValueError,'Duplicate'):index_existing(data)
    def test_ambiguous_title_rejected(self):
        with self.assertRaisesRegex(ValueError,'Ambiguous'):index_existing([{'number':3,'body':'manual','title':'[RP-001] Manual issue'}])
    def test_dry_run_no_remote_credentials(self):
        result=subprocess.run([sys.executable,str(ROOT/'scripts/import_github_issues.py'),'--repo','owner/repo'],text=True,capture_output=True,check=True,timeout=15)
        self.assertIn('49 planned issues',result.stdout);self.assertIn('No network calls or writes performed',result.stdout)
    def test_optional_selection(self):
        result=subprocess.run([sys.executable,str(ROOT/'scripts/import_github_issues.py'),'--repo','owner/repo','--include-optional','--milestone','M5'],text=True,capture_output=True,check=True,timeout=15)
        self.assertIn('5 planned issues',result.stdout)

if __name__=='__main__':unittest.main()
