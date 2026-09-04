from copy import deepcopy
import json
from pathlib import Path
import unittest
from reference_core import simulate, validate_level, compile_program

ROOT = Path(__file__).resolve().parents[1]
def load(lid):
    return (json.loads((ROOT/f'examples/levels/{lid}.json').read_text()),
            json.loads((ROOT/f'examples/programs/{lid}.json').read_text()))
def primitive_program(text):
    return {'schemaVersion':1,'engineRulesVersion':1,'commands':[
        {'id':f'n-{i}', 'op':{'F':'forward','L':'left','R':'right'}[x]} for i,x in enumerate(text)]}

class ReferenceTests(unittest.TestCase):
    def test_all_twelve_witnesses(self):
        fixtures=json.loads((ROOT/'examples/fixtures.json').read_text())
        self.assertEqual(len(fixtures),12)
        for f in fixtures:
            with self.subTest(level=f['level']):
                r=simulate(json.loads((ROOT/'examples'/f['level']).read_text()),json.loads((ROOT/'examples'/f['program']).read_text()))
                self.assertEqual(r['outcome'],'success')
                self.assertEqual(sum(r['awards'].values()),3)
    def test_deterministic_and_immutable(self):
        level,p=load('w3-02');before=deepcopy((level,p))
        self.assertEqual(simulate(level,p),simulate(level,p))
        self.assertEqual((level,p),before)
    def test_last_action_success(self):
        l,p=load('w1-01');l['limits']['maxActions']=2
        self.assertEqual(simulate(l,p)['outcome'],'success')
    def test_action_limit_has_next_action(self):
        l,p=load('w1-01');l['limits']['maxActions']=1
        r=simulate(l,p);self.assertEqual(r['outcome'],'out_of_actions');self.assertEqual(r['final']['actionsUsed'],1)
    def test_exact_end_away_from_goal_is_incomplete(self):
        l,_=load('w1-01');l['limits']['maxActions']=1
        self.assertEqual(simulate(l,primitive_program('F'))['outcome'],'incomplete')
    def test_blocked_wall_costs_one(self):
        l,_=load('w1-06');r=simulate(l,primitive_program('F'))
        self.assertEqual(r['outcome'],'blocked');self.assertEqual(r['final']['actionsUsed'],1)
        self.assertEqual((r['final']['x'],r['final']['y']),(0,0))
    def test_closed_gate_no_pickup(self):
        l,_=load('w3-01');l['collectibles']=[{'id':'hidden','x':1,'y':0,'kind':'required'}]
        r=simulate(l,primitive_program('F'))
        self.assertEqual(r['steps'][0]['blocked']['reason'],'closed_gate');self.assertEqual(r['final']['collected'],[])
    def test_goal_without_required_item(self):
        l,_=load('w1-08');r=simulate(l,primitive_program('FFFLFF'))
        self.assertEqual((r['final']['x'],r['final']['y']),(3,0));self.assertEqual(r['outcome'],'incomplete')
    def test_optional_direct_route_two_stars(self):
        l,_=load('w1-05');r=simulate(l,primitive_program('FF'))
        self.assertEqual(r['outcome'],'success');self.assertEqual(sum(r['awards'].values()),2)
    def test_unused_tail_still_costs_blocks(self):
        l,_=load('w1-01');l['commands']=['forward','right']
        r=simulate(l,primitive_program('FFR'))
        self.assertEqual(r['usedBlocks'],3);self.assertEqual(r['final']['actionsUsed'],2);self.assertFalse(r['awards']['efficiency'])
    def test_repeat_static_and_dynamic_cost(self):
        l,p=load('w2-01');r=simulate(l,p)
        self.assertEqual(r['usedBlocks'],2);self.assertEqual(r['final']['actionsUsed'],5)
    def test_repeat_early_success_source(self):
        l,p=load('w2-02');r=simulate(l,p)
        self.assertEqual(r['final']['actionsUsed'],11);self.assertEqual(r['steps'][-1]['source']['iteration'],3)
    def test_repeat_rejects_empty_body(self):
        l,p=load('w2-01');p['commands'][0]['body']=[]
        with self.assertRaisesRegex(ValueError,'REPEAT_BODY_EMPTY'):compile_program(p,l)
    def test_duplicate_node_id(self):
        l,p=load('w1-01');p['commands'][1]['id']=p['commands'][0]['id']
        with self.assertRaisesRegex(ValueError,'DUPLICATE_NODE_ID'):compile_program(p,l)
    def test_empty_program(self):
        l,_=load('w1-01')
        with self.assertRaisesRegex(ValueError,'EMPTY_PROGRAM'):compile_program(primitive_program(''),l)
    def test_static_cap(self):
        l,p=load('w1-01');l['limits']['maxBlocks']=1
        with self.assertRaisesRegex(ValueError,'BLOCK_LIMIT'):compile_program(p,l)
    def test_invalid_gate_reference(self):
        l,_=load('w3-01');l['switches'][0]['opens']=['missing']
        with self.assertRaisesRegex(ValueError,'INVALID_GATE_REFERENCE'):validate_level(l)
    def test_four_turns_restore_heading(self):
        l,_=load('w1-05');r=simulate(l,primitive_program('RRRR'))
        self.assertEqual(r['final']['facing'],l['start']['facing']);self.assertEqual((r['final']['x'],r['final']['y']),(0,0))
    def test_inputs_reset_for_second_run(self):
        l,p=load('w3-01');simulate(l,p)
        self.assertEqual(simulate(l,primitive_program('F'))['outcome'],'blocked')

if __name__=='__main__':unittest.main()
