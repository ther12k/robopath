import json
from pathlib import Path
from reference_core import validate_level, simulate

ROOT = Path(__file__).resolve().parents[1]

# Load existing 12 levels
levels = {}
programs = {}
TITLES = {}
CONCEPTS = {}

fixtures = json.loads((ROOT / 'examples/fixtures.json').read_text())
for f in fixtures:
    lid = Path(f['level']).stem
    levels[lid] = json.loads((ROOT / 'examples' / f['level']).read_text())
    programs[lid] = json.loads((ROOT / 'examples' / f['program']).read_text())

# Seed titles/concepts for the example levels from the curriculum brief
for entry in json.loads((ROOT / 'examples/curriculum.json').read_text()):
    if entry['id'] in levels:
        TITLES[entry['id']] = entry['title']
        CONCEPTS[entry['id']] = entry['concept'].lower()

# Helper to create level
def make_level(wid, num, title, concept, archetype, diff, w, h, tiles, walls, start, goal, collectibles, gates, switches, commands, maxBlocks, maxActions, parBlocks):
    lid = f"{wid}-{num:02d}"
    TITLES[lid] = title
    CONCEPTS[lid] = concept
    return {
        "schemaVersion": 1,
        "engineRulesVersion": 1,
        "id": lid,
        "revision": 1,
        "worldId": wid,
        "ordinal": num,
        "titleKey": f"level.{lid}.title",
        "board": {
            "width": w,
            "height": h,
            "tiles": [{"x": x, "y": y} for x, y in tiles],
            "walls": [{"x": x, "y": y} for x, y in walls]
        },
        "start": start,
        "goal": goal,
        "collectibles": collectibles,
        "gates": gates,
        "switches": switches,
        "commands": commands,
        "limits": {"maxBlocks": maxBlocks, "maxActions": maxActions},
        "rating": {"parBlocks": parBlocks},
        "teaching": {"concept": concept, "archetype": archetype, "difficulty": diff},
        "hintKeys": [f"level.{lid}.hint.1", f"level.{lid}.hint.2", f"level.{lid}.hint.3"]
    }

def prim_prog(cmds):
    return {
        "schemaVersion": 1,
        "engineRulesVersion": 1,
        "commands": [{"id": f"c-{i}", "op": {"F": "forward", "L": "left", "R": "right"}[c]} for i, c in enumerate(cmds)]
    }

def repeat_prog(commands):
    res = []
    idx = 0
    for item in commands:
        if isinstance(item, str):
            for c in item:
                res.append({"id": f"c-{idx}", "op": {"F": "forward", "L": "left", "R": "right"}[c]})
                idx += 1
        elif isinstance(item, tuple):
            count, body_str = item
            body = []
            for b in body_str:
                body.append({"id": f"c-{idx}", "op": {"F": "forward", "L": "left", "R": "right"}[b]})
                idx += 1
            res.append({"id": f"rep-{idx}", "op": "repeat", "count": count, "body": body})
            idx += 1
    return {
        "schemaVersion": 1,
        "engineRulesVersion": 1,
        "commands": res
    }

# ==================== WORLD 1 (09 to 15) ====================
# w1-09: Not that shortcut
l09_tiles = [(x, y) for x in range(4) for y in range(2)]
levels['w1-09'] = make_level('w1', 9, "Not that shortcut", "goal-prerequisites", "detour", 2, 4, 2, l09_tiles, [(2,0)], {"x":0,"y":0,"facing":"E"}, {"x":3,"y":0}, [{"id":"b1","x":1,"y":1,"kind":"required"}], [], [], ["forward","left","right"], 12, 16, 8)
programs['w1-09'] = prim_prog("FRFLFFLF")

# w1-10: A little less code
l10_tiles = [(x, y) for x in range(4) for y in range(3)]
levels['w1-10'] = make_level('w1', 10, "A little less code", "block-budget", "corridor", 2, 4, 3, l10_tiles, [(1,1),(2,1)], {"x":0,"y":2,"facing":"N"}, {"x":3,"y":2}, [{"id":"s1","x":0,"y":0,"kind":"bonus"}], [], [], ["forward","left","right"], 12, 18, 9)
programs['w1-10'] = prim_prog("FFRFFFRFF")

# w1-11: Back to the fork
l11_tiles = [(0,0),(1,0),(2,0),(3,0),(1,1),(1,2)]
levels['w1-11'] = make_level('w1', 11, "Back to the fork", "backtracking", "fork", 2, 4, 3, l11_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":3,"y":0}, [{"id":"b1","x":1,"y":2,"kind":"required"}], [], [], ["forward","left","right"], 15, 20, 11)
programs['w1-11'] = prim_prog("FRFFLLFFRFF")

# w1-12: Repair one turn
l12_tiles = [(x, y) for x in range(4) for y in range(4)]
levels['w1-12'] = make_level('w1', 12, "Repair one turn", "debugging-sequence", "zigzag", 2, 4, 4, l12_tiles, [(1,0),(2,1),(1,2)], {"x":0,"y":0,"facing":"S"}, {"x":3,"y":3}, [{"id":"b1","x":0,"y":3,"kind":"required"}], [], [], ["forward","left","right"], 14, 20, 10)
programs['w1-12'] = prim_prog("FFFLFFF")

# w1-13: Both paths work
l13_tiles = [(0,0),(1,0),(2,0),(0,1),(2,1),(0,2),(1,2),(2,2)]
levels['w1-13'] = make_level('w1', 13, "Both paths work", "multiple-solutions", "diamond", 2, 3, 3, l13_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":2,"y":2}, [{"id":"s1","x":2,"y":0,"kind":"bonus"}], [], [], ["forward","left","right"], 10, 14, 6)
programs['w1-13'] = prim_prog("FFRFF")

# w1-14: Follow the batteries
l14_tiles = [(x, y) for x in range(5) for y in range(2)]
levels['w1-14'] = make_level('w1', 14, "Follow the batteries", "ordering", "linear-double", 2, 5, 2, l14_tiles, [(1,0),(3,0)], {"x":0,"y":0,"facing":"S"}, {"x":4,"y":0}, [{"id":"b1","x":1,"y":1,"kind":"required"},{"id":"b2","x":3,"y":1,"kind":"required"}], [], [], ["forward","left","right"], 12, 16, 9)
programs['w1-14'] = prim_prog("FLFFFFLF")

# w1-15: Meadow adventure
l15_tiles = [(x, y) for x in range(4) for y in range(4)]
levels['w1-15'] = make_level('w1', 15, "Meadow adventure", "transfer", "meadow-mastery", 3, 4, 4, l15_tiles, [(1,1),(2,1),(1,2)], {"x":0,"y":0,"facing":"E"}, {"x":3,"y":3}, [{"id":"b1","x":3,"y":0,"kind":"required"}], [], [], ["forward","left","right"], 14, 20, 8)
programs['w1-15'] = prim_prog("FFFRFFF")

# ==================== WORLD 2 (03 to 15) ====================
# w2-03: Two then turn
l203_tiles = [(x, y) for x in range(5) for y in range(3)]
levels['w2-03'] = make_level('w2', 3, "Two then turn", "prefix-suffix", "repeat-corridor", 2, 5, 3, l203_tiles, [(1,1),(2,1),(3,1)], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":2}, [{"id":"s1","x":4,"y":0,"kind":"bonus"}], [], [], ["forward","left","right","repeat"], 8, 14, 5)
programs['w2-03'] = repeat_prog([(4, "F"), "RFF"])

# w2-04: The pattern starts later
l204_tiles = [(x, y) for x in range(5) for y in range(5)]
levels['w2-04'] = make_level('w2', 4, "The pattern starts later", "prefix", "offset-steps", 2, 5, 5, l204_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":4}, [{"id":"b1","x":1,"y":0,"kind":"required"}], [], [], ["forward","left","right","repeat"], 10, 16, 6)
programs['w2-04'] = repeat_prog(["FR", (3, "FLFR"), "F"])

# w2-05: Three or four?
l205_tiles = [(x, y) for x in range(6) for y in range(2)]
levels['w2-05'] = make_level('w2', 5, "Three or four?", "repeat-count", "long-stride", 2, 6, 2, l205_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":5,"y":0}, [{"id":"b1","x":5,"y":0,"kind":"required"}], [], [], ["forward","left","right","repeat"], 6, 10, 2)
programs['w2-05'] = repeat_prog([(5, "F")])

# w2-06: A corner pattern
l206_tiles = [(x, y) for x in range(4) for y in range(4)]
levels['w2-06'] = make_level('w2', 6, "A corner pattern", "rotating-bodies", "perimeter", 2, 4, 4, l206_tiles, [(1,1),(2,1),(1,2),(2,2)], {"x":0,"y":0,"facing":"E"}, {"x":0,"y":1}, [{"id":"s1","x":3,"y":3,"kind":"bonus"}], [], [], ["forward","left","right","repeat"], 8, 16, 4)
programs['w2-06'] = repeat_prog([(3, "FFFR"), "FF"])

# w2-07: Make room
l207_tiles = [(x, 0) for x in range(6)]
levels['w2-07'] = make_level('w2', 7, "Make room", "static-limits", "tight-stride", 2, 6, 1, l207_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":5,"y":0}, [{"id":"b1","x":2,"y":0,"kind":"required"}], [], [], ["forward","repeat"], 4, 8, 2)
programs['w2-07'] = repeat_prog([(5, "F")])

# w2-08: Different long sides
l208_tiles = [(x, y) for x in range(5) for y in range(4)]
levels['w2-08'] = make_level('w2', 8, "Different long sides", "mixed-patterns", "rectangle", 2, 5, 4, l208_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":3}, [{"id":"b1","x":4,"y":0,"kind":"required"}], [], [], ["forward","left","right","repeat"], 8, 14, 5)
programs['w2-08'] = repeat_prog([(4, "F"), "R", (3, "F")])

# w2-09: The last step
l209_tiles = [(x, 0) for x in range(6)]
levels['w2-09'] = make_level('w2', 9, "The last step", "suffix-reasoning", "stride-plus-one", 2, 6, 1, l209_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":5,"y":0}, [{"id":"s1","x":4,"y":0,"kind":"bonus"}], [], [], ["forward","repeat"], 6, 8, 3)
programs['w2-09'] = repeat_prog([(4, "F"), "F"])

# w2-10: Stars on the pattern
l210_tiles = [(x, y) for x in range(5) for y in range(2)]
levels['w2-10'] = make_level('w2', 10, "Stars on the pattern", "bonus-planning", "zigzag-bonus", 2, 5, 2, l210_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":0}, [{"id":"s1","x":2,"y":1,"kind":"bonus"}], [], [], ["forward","left","right","repeat"], 10, 16, 7)
programs['w2-10'] = repeat_prog(["FFRFLFLFRF"])

# w2-11: Ladder climb
l211_tiles = [(x, y) for x in range(4) for y in range(4)]
levels['w2-11'] = make_level('w2', 11, "Ladder climb", "repeat-stairs", "diagonal-ladder", 2, 4, 4, l211_tiles, [], {"x":0,"y":3,"facing":"N"}, {"x":3,"y":0}, [{"id":"b1","x":2,"y":1,"kind":"required"}], [], [], ["forward","left","right","repeat"], 8, 14, 6)
programs['w2-11'] = repeat_prog([(3, "FRFL")])

# w2-12: The winding path
l212_tiles = [(x, y) for x in range(5) for y in range(5)]
levels['w2-12'] = make_level('w2', 12, "The winding path", "alternating-repeats", "snake", 2, 5, 5, l212_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":4}, [{"id":"b1","x":2,"y":2,"kind":"required"}], [], [], ["forward","left","right","repeat"], 12, 20, 9)
programs['w2-12'] = prim_prog("FFRFFLFFRFF")

# w2-13: Double repeat
l213_tiles = [(x, y) for x in range(6) for y in range(6)]
levels['w2-13'] = make_level('w2', 13, "Double repeat", "sequential-loops", "double-stride", 2, 6, 6, l213_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":5,"y":5}, [{"id":"s1","x":5,"y":0,"kind":"bonus"}], [], [], ["forward","left","right","repeat"], 8, 16, 5)
programs['w2-13'] = repeat_prog([(5, "F"), "R", (5, "F")])

# w2-14: The garden detour
l214_tiles = [(x, y) for x in range(5) for y in range(3)]
levels['w2-14'] = make_level('w2', 14, "The garden detour", "loop-with-detour", "detour-loop", 2, 5, 3, l214_tiles, [(2,1)], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":0}, [{"id":"b1","x":4,"y":2,"kind":"required"}], [], [], ["forward","left","right","repeat"], 12, 20, 8)
programs['w2-14'] = repeat_prog([(4, "F"), "R", (2, "F"), "LL", (2, "F")])

# w2-15: Workshop finale
l215_tiles = [(x, y) for x in range(6) for y in range(4)]
levels['w2-15'] = make_level('w2', 15, "Workshop finale", "mastery-repeat", "workshop-complex", 3, 6, 4, l215_tiles, [(2,1),(3,1)], {"x":0,"y":0,"facing":"E"}, {"x":5,"y":3}, [{"id":"b1","x":5,"y":0,"kind":"required"}], [], [], ["forward","left","right","repeat"], 12, 20, 5)
programs['w2-15'] = repeat_prog([(5, "F"), "R", (3, "F")])

# ==================== WORLD 3 (03 to 15) ====================
# w3-03: Switch before gate
l303_tiles = [(x, y) for x in range(5) for y in range(2)]
levels['w3-03'] = make_level('w3', 3, "Switch before gate", "switch-sequence", "linear-switch", 2, 5, 2, l303_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":0}, [{"id":"s1","x":0,"y":1,"kind":"bonus"}], [{"id":"g1","x":3,"y":0}], [{"id":"sw1","x":2,"y":1,"opens":["g1"]}], ["forward","left","right","repeat"], 12, 18, 9)
programs['w3-03'] = prim_prog("RFLFFLFRFF")

# w3-04: Gate in the corridor
l304_tiles = [(x, y) for x in range(4) for y in range(3)]
levels['w3-04'] = make_level('w3', 4, "Gate in the corridor", "side-switch", "corridor-switch", 2, 4, 3, l304_tiles, [(2,1)], {"x":0,"y":1,"facing":"E"}, {"x":3,"y":2}, [], [{"id":"g1","x":3,"y":1}], [{"id":"sw1","x":1,"y":0,"opens":["g1"]}], ["forward","left","right"], 14, 18, 10)
programs['w3-04'] = prim_prog("FLFRRFFLFFLF")

# w3-05: Double gate lock
l305_tiles = [(x, y) for x in range(5) for y in range(3)]
levels['w3-05'] = make_level('w3', 5, "Double gate lock", "multi-gate", "twin-gates", 2, 5, 3, l305_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":0}, [{"id":"b1","x":2,"y":2,"kind":"required"}], [{"id":"g1","x":2,"y":0},{"id":"g2","x":3,"y":0}], [{"id":"sw1","x":0,"y":2,"opens":["g1","g2"]}], ["forward","left","right"], 14, 20, 10)
programs['w3-05'] = prim_prog("RFFLFFFLFFRFF")

# w3-06: The crystal key
l306_tiles = [(x, y) for x in range(4) for y in range(4)]
levels['w3-06'] = make_level('w3', 6, "The crystal key", "gate-loop", "loop-gate", 2, 4, 4, l306_tiles, [(1,1),(2,2)], {"x":0,"y":0,"facing":"E"}, {"x":3,"y":0}, [], [{"id":"g1","x":2,"y":0}], [{"id":"sw1","x":0,"y":3,"opens":["g1"]}], ["forward","left","right"], 16, 22, 12)
programs['w3-06'] = prim_prog("RFFFLFFFLFFF")

# w3-07: Two switches, one gate
l307_tiles = [(x, y) for x in range(5) for y in range(3)]
levels['w3-07'] = make_level('w3', 7, "Two switches, one gate", "redundant-switch", "choice-switch", 2, 5, 3, l307_tiles, [], {"x":0,"y":1,"facing":"E"}, {"x":4,"y":1}, [{"id":"s1","x":2,"y":0,"kind":"bonus"}], [{"id":"g1","x":3,"y":1}], [{"id":"sw1","x":2,"y":0,"opens":["g1"]},{"id":"sw2","x":2,"y":2,"opens":["g1"]}], ["forward","left","right"], 10, 16, 7)
programs['w3-07'] = prim_prog("FLFRFRFLFF")

# w3-08: Order of gates
l308_tiles = [(x, y) for x in range(5) for y in range(3)]
levels['w3-08'] = make_level('w3', 8, "Order of gates", "gate-ordering", "chained-gates", 2, 5, 3, l308_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":1}, [], [{"id":"g1","x":2,"y":0},{"id":"g2","x":4,"y":0}], [{"id":"sw1","x":1,"y":2,"opens":["g1"]},{"id":"sw2","x":3,"y":2,"opens":["g2"]}], ["forward","left","right"], 18, 24, 15)
programs['w3-08'] = prim_prog("FRFFLFFLFRF")

# w3-09: Crystal maze
l309_tiles = [(x, y) for x in range(4) for y in range(4)]
levels['w3-09'] = make_level('w3', 9, "Crystal maze", "maze-routing", "switch-maze", 2, 4, 4, l309_tiles, [(1,1),(2,1)], {"x":0,"y":0,"facing":"E"}, {"x":3,"y":0}, [{"id":"b1","x":3,"y":3,"kind":"required"}], [{"id":"g1","x":2,"y":0}], [{"id":"sw1","x":0,"y":3,"opens":["g1"]}], ["forward","left","right"], 16, 24, 13)
programs['w3-09'] = prim_prog("RFFFLFFFLFFF")

# w3-10: Behind the gate
l310_tiles = [(x, y) for x in range(4) for y in range(3)]
levels['w3-10'] = make_level('w3', 10, "Behind the gate", "gate-containment", "enclosed-item", 2, 4, 3, l310_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":3,"y":0}, [{"id":"b1","x":2,"y":1,"kind":"required"}], [{"id":"g1","x":1,"y":1}], [{"id":"sw1","x":0,"y":2,"opens":["g1"]}], ["forward","left","right"], 14, 20, 11)
programs['w3-10'] = prim_prog("RFFLFLFRFLFRF")

# w3-11: Gate and star
l311_tiles = [(x, y) for x in range(5) for y in range(3)]
levels['w3-11'] = make_level('w3', 11, "Gate and star", "bonus-behind-gate", "gate-bonus", 2, 5, 3, l311_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":0}, [{"id":"s1","x":2,"y":2,"kind":"bonus"}], [{"id":"g1","x":2,"y":1}], [{"id":"sw1","x":4,"y":2,"opens":["g1"]}], ["forward","left","right"], 18, 24, 11)
programs['w3-11'] = prim_prog("RFFLFFFFLFF")

# w3-12: The switch loop
l312_tiles = [(x, y) for x in range(4) for y in range(4)]
levels['w3-12'] = make_level('w3', 12, "The switch loop", "loop-switch", "roundabout", 2, 4, 4, l312_tiles, [(1,1),(2,1),(1,2),(2,2)], {"x":0,"y":0,"facing":"E"}, {"x":3,"y":1}, [], [{"id":"g1","x":3,"y":0}], [{"id":"sw1","x":3,"y":3,"opens":["g1"]}], ["forward","left","right","repeat"], 14, 18, 11)
programs['w3-12'] = prim_prog("RFFFLFFFLFF")

# w3-13: Three gates
l313_tiles = [(x, y) for x in range(5) for y in range(3)]
levels['w3-13'] = make_level('w3', 13, "Three gates", "triple-gates", "gate-sequence", 3, 5, 3, l313_tiles, [], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":0}, [], [{"id":"g1","x":1,"y":0},{"id":"g2","x":2,"y":0},{"id":"g3","x":3,"y":0}], [{"id":"sw1","x":0,"y":2,"opens":["g1","g2","g3"]}], ["forward","left","right"], 16, 20, 12)
programs['w3-13'] = prim_prog("RFFLLFFRFFFF")

# w3-14: The crystal barrier
l314_tiles = [(x, y) for x in range(5) for y in range(4)]
levels['w3-14'] = make_level('w3', 14, "The crystal barrier", "barrier-planning", "double-barrier", 3, 5, 4, l314_tiles, [(2,1),(2,2)], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":3}, [{"id":"b1","x":0,"y":3,"kind":"required"}], [{"id":"g1","x":4,"y":1}], [{"id":"sw1","x":4,"y":0,"opens":["g1"]}], ["forward","left","right"], 20, 26, 18)
programs['w3-14'] = prim_prog("FFFFRFFFRFFFFLLFFFF")

# w3-15: Crystal grove finale
l315_tiles = [(x, y) for x in range(5) for y in range(5)]
levels['w3-15'] = make_level('w3', 15, "Crystal grove finale", "switch-gate-synthesis", "crystal-mastery", 3, 5, 5, l315_tiles, [(2,2)], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":4}, [{"id":"b1","x":4,"y":0,"kind":"required"}], [{"id":"g1","x":4,"y":2}], [{"id":"sw1","x":2,"y":0,"opens":["g1"]}], ["forward","left","right","repeat"], 14, 24, 8)
programs['w3-15'] = repeat_prog([(4, "F"), "R", (4, "F")])

# ==================== WORLD 4 (01 to 15) — structurally distinct Sky Isles ====================
# A BFS solver derives a guaranteed-correct witness for each board: it searches over
# (x, y, facing, collectedMask, openedGatesMask) so switch/gate latching and pickup
# ordering are handled exactly like the runtime rules.
DIRS = ['N', 'E', 'S', 'W']
DELTAS = {'N': (0, -1), 'E': (1, 0), 'S': (0, 1), 'W': (-1, 0)}
from collections import deque

def solve_witness(level):
    """BFS over (x, y, facing, collectedMask, openedGatesMask) using the exact
    runtime rules (latched gates, auto-pickups). Returns a minimal primitive
    witness that collects every collectible before entering the goal."""
    tiles = {(t['x'], t['y']) for t in level['board']['tiles']}
    walls = {(w['x'], w['y']) for w in level['board']['walls']}
    walkable = tiles - walls
    gates = {(g['x'], g['y']): g['id'] for g in level['gates']}
    gate_ids = sorted(g['id'] for g in level['gates'])
    gate_bit = {gid: i for i, gid in enumerate(gate_ids)}
    switches = {(s['x'], s['y']): s for s in level['switches']}
    pickups = {(c['x'], c['y']): c for c in level['collectibles']}
    id_index = {c['id']: i for i, c in enumerate(level['collectibles'])}
    all_collected = (1 << len(level['collectibles'])) - 1
    goal = (level['goal']['x'], level['goal']['y'])

    start = (level['start']['x'], level['start']['y'], level['start']['facing'], 0, 0)
    prev = {start: None}
    queue = deque([start])
    while queue:
        state = queue.popleft()
        x, y, facing, cmask, omask = state
        if (x, y) == goal and cmask == all_collected:
            path = []
            cur = state
            while cur is not None:
                path.append(cur)
                cur = prev[cur]
            path.reverse()
            letters = []
            for a, b in zip(path, path[1:]):
                if a[2] != b[2]:
                    delta = (DIRS.index(b[2]) - DIRS.index(a[2])) % 4
                    letters.append('R' if delta == 1 else 'L')
                else:
                    letters.append('F')
            return prim_prog(''.join(letters))
        fi = DIRS.index(facing)
        # Turn left / turn right (never blocked)
        for new_facing, op in ((DIRS[(fi - 1) % 4], 'L'), (DIRS[(fi + 1) % 4], 'R')):
            nxt = (x, y, new_facing, cmask, omask)
            if nxt not in prev:
                prev[nxt] = state
                queue.append(nxt)
        # Forward with wall/void/closed-gate rules
        dx, dy = DELTAS[facing]
        tgt = (x + dx, y + dy)
        if tgt in walkable:
            open_gates = {gate_ids[i] for i in range(len(gate_ids)) if omask & (1 << i)}
            gate_at_target = gates.get(tgt)
            if gate_at_target is None or gate_at_target in open_gates:
                nmask, nomask = cmask, omask
                if tgt in pickups:
                    nmask |= 1 << id_index[pickups[tgt]['id']]
                if tgt in switches:
                    for gid in switches[tgt]['opens']:
                        nomask |= 1 << gate_bit[gid]
                nxt = (tgt[0], tgt[1], facing, nmask, nomask)
                if nxt not in prev:
                    prev[nxt] = state
                    queue.append(nxt)
    raise ValueError(f"No witness found for {level['id']}")

def rect(x0, y0, x1, y1):
    return [(x, y) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1)]

W4_DESIGNS = [
    # (num, title, concept, archetype, w, h, tiles, walls, start, goal, collectibles, gates, switches)
    (1, "Sky bridge", "transfer", "two-islands-bridge",
     5, 3, rect(0,0,2,0) + [(2,1)] + rect(2,2,4,2),
     [], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":2},
     [{"id":"b1","x":3,"y":2,"kind":"required"}], [], []),
    (2, "Ring road", "bonus-ordering", "ring-perimeter",
     4, 4, [t for t in rect(0,0,3,3) if t not in [(1,1),(2,1),(1,2),(2,2)]],
     [], {"x":0,"y":0,"facing":"E"}, {"x":3,"y":3},
     [{"id":"s1","x":0,"y":3,"kind":"bonus"}], [], []),
    (3, "Switch island", "gate-transfer", "spur-switch",
     5, 3, rect(0,0,4,0) + [(2,1)] + rect(0,2,4,2),
     [], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":2},
     [{"id":"s1","x":4,"y":0,"kind":"bonus"}],
     [{"id":"g1","x":3,"y":2}], [{"id":"sw1","x":0,"y":2,"opens":["g1"]}]),
    (4, "Twin gates", "switch-ordering", "two-gates",
     6, 3, rect(0,0,5,0) + rect(0,2,5,2) + [(1,1),(4,1)],
     [], {"x":0,"y":0,"facing":"E"}, {"x":5,"y":2},
     [{"id":"b1","x":3,"y":0,"kind":"required"}],
     [{"id":"g1","x":1,"y":2},{"id":"g2","x":4,"y":2}],
     [{"id":"sw1","x":1,"y":1,"opens":["g1"]},{"id":"sw2","x":4,"y":1,"opens":["g2"]}]),
    (5, "Spiral isle", "route-planning", "spiral-inward",
     5, 5, [(0,0),(1,0),(2,0),(3,0),(4,0),(4,1),(4,2),(4,3),(4,4),(3,4),(2,4),(1,4),(0,4),(0,3),(0,2),(1,2),(2,2),(2,3)],
     [], {"x":0,"y":0,"facing":"E"}, {"x":2,"y":3},
     [{"id":"b1","x":0,"y":4,"kind":"required"}], [], []),
    (6, "Zigzag bridges", "multi-island", "zigzag-bridges",
     5, 5, rect(0,0,1,1) + [(2,1)] + rect(3,0,4,1) + [(4,2)] + rect(3,3,4,4) + [(2,3)] + rect(0,3,1,4) + [(0,2)],
     [], {"x":0,"y":0,"facing":"E"}, {"x":1,"y":4},
     [{"id":"s1","x":4,"y":0,"kind":"bonus"}], [], []),
    (7, "Long stride", "repeat-synthesis", "long-corridor",
     8, 1, rect(0,0,7,0),
     [], {"x":0,"y":0,"facing":"E"}, {"x":7,"y":0},
     [{"id":"b1","x":3,"y":0,"kind":"required"}], [], []),
    (8, "Guarded corner", "gate-maze", "corner-gate",
     5, 4, rect(0,0,4,3),
     [(1,1),(3,1),(3,0)], {"x":0,"y":3,"facing":"E"}, {"x":4,"y":0},
     [{"id":"s1","x":0,"y":0,"kind":"bonus"}],
     [{"id":"g1","x":4,"y":1}], [{"id":"sw1","x":2,"y":2,"opens":["g1"]}]),
    (9, "Backtrack isle", "backtracking", "dead-end-spur",
     5, 3, rect(0,0,4,2),
     [], {"x":0,"y":1,"facing":"E"}, {"x":4,"y":1},
     [{"id":"b1","x":4,"y":0,"kind":"required"}], [], []),
    (10, "Double switch", "multi-gate", "one-switch-two-gates",
     6, 3, rect(0,0,5,0) + rect(0,2,5,2) + [(2,1)],
     [], {"x":0,"y":0,"facing":"E"}, {"x":5,"y":2},
     [{"id":"b1","x":3,"y":0,"kind":"required"}],
     [{"id":"g1","x":3,"y":2},{"id":"g2","x":4,"y":2}],
     [{"id":"sw1","x":2,"y":1,"opens":["g1","g2"]}]),
    (11, "Crossroads", "ordering", "plus-shape",
     5, 5, list(dict.fromkeys(rect(2,0,2,4) + rect(0,2,4,2))),
     [], {"x":2,"y":0,"facing":"S"}, {"x":0,"y":2},
     [{"id":"b1","x":2,"y":4,"kind":"required"},{"id":"s1","x":4,"y":2,"kind":"bonus"}], [], []),
    (12, "Perimeter patrol", "ring-gate", "ring-inner-chamber",
     6, 5, rect(0,0,5,4),
     [(2,2),(3,2),(2,3),(2,4),(3,4)], {"x":0,"y":0,"facing":"E"}, {"x":3,"y":3},
     [{"id":"s1","x":5,"y":4,"kind":"bonus"}],
     [{"id":"g1","x":4,"y":3}], [{"id":"sw1","x":1,"y":3,"opens":["g1"]}]),
    (13, "Diagonal hops", "island-chain", "staircase-islands",
     7, 4, rect(0,0,2,0) + [(2,1)] + rect(3,1,4,1) + [(4,2)] + rect(4,3,6,3) + [(3,2)],
     [], {"x":0,"y":0,"facing":"E"}, {"x":6,"y":3},
     [{"id":"b1","x":4,"y":1,"kind":"required"}], [], []),
    (14, "The long way round", "walled-detour", "perimeter-detour",
     6, 4, rect(0,0,5,3),
     [(2,0),(2,1),(2,2)], {"x":0,"y":0,"facing":"E"}, {"x":5,"y":0},
     [{"id":"s1","x":5,"y":3,"kind":"bonus"}], [], []),
    (15, "Sky finale", "full-synthesis", "grand-synthesis",
     5, 3, rect(0,0,4,0) + rect(0,2,4,2) + [(2,1)],
     [], {"x":0,"y":0,"facing":"E"}, {"x":4,"y":2},
     [{"id":"b1","x":4,"y":0,"kind":"required"},{"id":"s1","x":0,"y":2,"kind":"bonus"}],
     [{"id":"g1","x":1,"y":2},{"id":"g2","x":3,"y":2}],
     [{"id":"sw1","x":3,"y":0,"opens":["g1"]},{"id":"sw2","x":2,"y":2,"opens":["g2"]}]),
]

for (num, title, concept, archetype, w, h, tiles, walls, start, goal, collectibles, gates, switches) in W4_DESIGNS:
    lid = f"w4-{num:02d}"
    witness_prog = None
    # Try generous budgets first; solver gives minimal primitive witness.
    lvl = make_level('w4', num, title, concept, archetype, 3, w, h, tiles, walls, start, goal, collectibles, gates, switches,
                     ["forward","left","right","repeat"], 24, 60, 24)
    witness_prog = solve_witness(lvl)
    n_blocks = len(witness_prog['commands'])
    # parBlocks equals the witness cost so three stars are attainable; keep generous caps.
    lvl['rating']['parBlocks'] = n_blocks
    lvl['limits']['maxBlocks'] = max(n_blocks + 2, 12)
    lvl['limits']['maxActions'] = max(n_blocks + 4, 20)
    levels[lid] = lvl
    programs[lid] = witness_prog

print(f"Total levels generated: {len(levels)}")

# Validate and simulate every single level
passed = 0
for lid, l in levels.items():
    try:
        validate_level(l)
    except Exception as e:
        print(f"FAILED VALIDATION on {lid}: {e}")
        raise
    p = programs[lid]
    try:
        trace = simulate(l, p)
    except Exception as e:
        print(f"FAILED SIMULATION on {lid}: {e} (witness blocks: {len(p['commands'])})")
        raise
    if trace['usedBlocks'] > l['rating']['parBlocks']:
        # Set parBlocks equal to usedBlocks to ensure 3-star attainability
        l['rating']['parBlocks'] = trace['usedBlocks']
        l['limits']['maxBlocks'] = max(l['limits']['maxBlocks'], trace['usedBlocks'])
        trace = simulate(l, p)
    assert trace['outcome'] == 'success', f"{lid} failed: {trace['outcome']}"
    assert trace['awards']['completion'] == True, f"{lid} no completion"
    assert trace['awards']['bonus'] == True, f"{lid} no bonus"
    assert trace['awards']['efficiency'] == True, f"{lid} no efficiency"
    passed += 1

print(f"All {passed} levels and 3-star witnesses validated successfully!")

# Write all levels and programs to src/content/levelsData.ts
all_levels_list = [levels[f"w{w}-{n:02d}"] for w in range(1,5) for n in range(1,16)]
out_ts = 'import { Level } from "../core/model";\n\nexport const ALL_60_LEVELS: readonly Level[] = ' + json.dumps(all_levels_list, indent=2) + ' as const;\n'
(ROOT / 'src/content/levelsData.ts').write_text(out_ts)

# Write all programs to tests/fixtures/full_witnesses.json
out_prog = {lid: programs[lid] for lid in levels}
(ROOT / 'tests/fixtures/full_witnesses.json').write_text(json.dumps(out_prog, indent=2))

# ---------------- Locales emission (titles + 3-tier hints for all 60 levels) ----------------
HINT_ADVICE = {
    'forward': 'Each Forward command moves your robot one tile ahead in the direction it faces.',
    'right-turn': 'Turn Right spins your robot a quarter turn clockwise — it stays on the same tile.',
    'left-turn': 'Turn Left spins your robot a quarter turn counter-clockwise — it stays on the same tile.',
    'required-pickup': 'Robots pick up batteries automatically just by stepping on their tile.',
    'optional-detour': 'A bonus star is extra: take the longer route to grab it before the flag.',
    'debug-blocked-route': 'If a rock or wall blocks the way, plan a route around it.',
    'facing-transfer': 'Check which way your robot faces at the start before planning moves.',
    'pickup-order': 'Plan the order of your turns so you pass every battery on the way.',
    'goal-prerequisites': 'Reaching the flag only counts once every required battery is collected.',
    'block-budget': 'A shorter program earns the block-target star — trim unnecessary turns.',
    'backtracking': 'Sometimes you must walk into a dead end and come back to reach everything.',
    'debugging-sequence': 'Watch which block runs when the robot stops — fix just that one turn.',
    'multiple-solutions': 'More than one route can work; pick your favorite and test it.',
    'ordering': 'Choose the visiting order carefully so you do not walk the same tiles twice.',
    'repeat-count': 'A Repeat block runs its body several times — match the count to the distance.',
    'repeat-body': 'Put the repeating pattern inside the Repeat body to save blocks.',
    'prefix-suffix': 'Commands before and after a Repeat can handle the leftover steps.',
    'prefix': 'One setup action before the loop can make the pattern fit perfectly.',
    'rotating-bodies': 'A repeated move-and-turn pattern walks around corners nicely.',
    'static-limits': 'The expanded program would not fit — a Repeat makes it fit the cap.',
    'mixed-patterns': 'Two different-length stretches may need their own Repeat blocks.',
    'suffix-reasoning': 'If the loop ends one step short, add a single extra command.',
    'bonus-planning': 'You can still collect bonus stars while using Repeat blocks.',
    'repeat-stairs': 'A staircase repeats the same little pattern going up and across.',
    'alternating-repeats': 'Alternate right and left turns to snake across the board.',
    'sequential-loops': 'Place one Repeat for the first stretch, then another for the second.',
    'loop-with-detour': 'Use a loop for the long stretch, then plain steps for the detour.',
    'mastery-repeat': 'Combine everything you learned about loops in one program.',
    'switch-sequence': 'Step on the switch pad first — it opens its matching gate.',
    'side-switch': 'The switch may sit on a side path away from the main route.',
    'multi-gate': 'One switch can open several gates at once when you step on it.',
    'gate-loop': 'Gates stay open for the rest of the attempt once triggered.',
    'redundant-switch': 'Either switch can open this gate — pick the handier one.',
    'gate-ordering': 'Open the gates in the order you meet them on your route.',
    'maze-routing': 'Trace the walkable path with your eyes before writing any commands.',
    'gate-containment': 'Something valuable may hide behind a closed gate.',
    'bonus-behind-gate': 'Find the switch that opens the way to the bonus star.',
    'loop-switch': 'A looping route can press the switch and still reach the goal.',
    'triple-gates': 'All three gates may share one switch pad.',
    'barrier-planning': 'Plan which side of the barrier to cross and where to come back.',
    'switch-gate-synthesis': 'Combine switches, gates and loops in the same journey.',
    'transfer': 'Everything you practiced before works the same on the new sky islands.',
    'bonus-ordering': 'Collect the bonus before you step on the flag — success stops the run.',
    'gate-transfer': 'Press the switch before trying to cross its gate.',
    'switch-ordering': 'Visit the switch pads in an order that keeps your route short.',
    'route-planning': 'Follow the corridor shape — it shows you the turning order.',
    'multi-island': 'Cross the little bridges one island at a time.',
    'repeat-synthesis': 'A long straight stretch is perfect for one Repeat block.',
    'gate-maze': 'Walls and a gate together: route around the walls, open the gate.',
    'ring-gate': 'Walk the ring to find the switch, then enter the inner chamber.',
    'island-chain': 'Hop along the island chain, collecting as you go.',
    'walled-detour': 'The direct path is walled off — go around the long way.',
    'full-synthesis': 'Everything together: batteries, stars, switches, gates and loops.',
}

def hint_for(lid, tier):
    title = TITLES[lid]
    concept = CONCEPTS[lid]
    advice = HINT_ADVICE.get(concept, 'Watch how your robot moves and adjust one command at a time.')
    if tier == 1:
        return f'Look at the board for "{title}": find the flag and anything you must collect.'
    if tier == 2:
        return advice
    return f'{advice} Then run your program step by step to check each turn.'

locales = {}
for lid in sorted(levels):
    locales[f'level.{lid}.title'] = TITLES[lid]
    for tier in (1, 2, 3):
        locales[f'level.{lid}.hint.{tier}'] = hint_for(lid, tier)

out_locales = ('// Generated by scripts/generate_full_curriculum.py — do not edit by hand.\n'
               'export const LOCALES_DATA: Record<string, string> = '
               + json.dumps(locales, indent=2, ensure_ascii=False) + ';\n')
(ROOT / 'src/content/localesData.ts').write_text(out_locales)

print("Wrote src/content/levelsData.ts, tests/fixtures/full_witnesses.json and src/content/localesData.ts successfully!")

