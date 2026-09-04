#!/usr/bin/env python3
"""Rules-v1 headless specification oracle. Not production game code.

Schema validation must precede these semantic functions for untrusted input.
No browser, renderer, timing, network, persistence or robot-skin behavior is modeled.
"""
from __future__ import annotations
from copy import deepcopy
from typing import Any

DIRECTIONS = ('N', 'E', 'S', 'W')
DELTAS = {'N': (0, -1), 'E': (1, 0), 'S': (0, 1), 'W': (-1, 0)}
PRIMITIVES = {'forward', 'left', 'right'}


def xy(value: dict[str, Any]) -> tuple[int, int]:
    return value['x'], value['y']


def validate_level(level: dict[str, Any]) -> None:
    """Semantic checks in addition to the supplied strict JSON schema."""
    board = level['board']
    tiles = {xy(p) for p in board['tiles']}
    walls = {xy(p) for p in board['walls']}
    if len(tiles) != len(board['tiles']) or len(walls) != len(board['walls']):
        raise ValueError('DUPLICATE_COORDINATE')
    if not walls <= tiles:
        raise ValueError('WALL_OUTSIDE_TILES')
    for x, y in tiles:
        if not (0 <= x < board['width'] and 0 <= y < board['height']):
            raise ValueError('OUT_OF_BOUNDS')
    start, goal = xy(level['start']), xy(level['goal'])
    if start == goal or start not in tiles - walls or goal not in tiles - walls:
        raise ValueError('INVALID_START_GOAL')
    if level['start']['facing'] not in DIRECTIONS:
        raise ValueError('INVALID_FACING')
    gate_ids = {g['id'] for g in level['gates']}
    all_ids: set[str] = set()
    used_positions: dict[str, set[tuple[int, int]]] = {}
    for name in ('collectibles', 'gates', 'switches'):
        used_positions[name] = set()
        for entity in level[name]:
            pos = xy(entity)
            if entity['id'] in all_ids or pos in used_positions[name]:
                raise ValueError('DUPLICATE_ENTITY')
            all_ids.add(entity['id'])
            used_positions[name].add(pos)
            if pos not in tiles - walls:
                raise ValueError('ENTITY_NOT_WALKABLE')
    if start in used_positions['collectibles']:
        raise ValueError('PICKUP_ON_START')
    if used_positions['gates'] & used_positions['switches']:
        raise ValueError('SWITCH_GATE_OVERLAP')
    if {start, goal} & (used_positions['gates'] | used_positions['switches']):
        raise ValueError('INTERACTIVE_START_GOAL')
    referenced: set[str] = set()
    for switch in level['switches']:
        if not switch['opens'] or not set(switch['opens']) <= gate_ids:
            raise ValueError('INVALID_GATE_REFERENCE')
        referenced.update(switch['opens'])
    if referenced != gate_ids:
        raise ValueError('UNREFERENCED_GATE')
    if level['rating']['parBlocks'] > level['limits']['maxBlocks']:
        raise ValueError('TARGET_EXCEEDS_CAP')
    if level['id'] != f"{level['worldId']}-{level['ordinal']:02}":
        raise ValueError('LEVEL_ID_ORDINAL_MISMATCH')


def compile_program(program: dict[str, Any], level: dict[str, Any]) -> tuple[list[dict[str, Any]], int]:
    if not program.get('commands'):
        raise ValueError('EMPTY_PROGRAM')
    if program.get('schemaVersion') != 1 or program.get('engineRulesVersion') != 1:
        raise ValueError('PROGRAM_VERSION')
    ids: set[str] = set()
    output: list[dict[str, Any]] = []
    cost = 0
    for index, node in enumerate(program['commands']):
        if node['id'] in ids:
            raise ValueError('DUPLICATE_NODE_ID')
        ids.add(node['id'])
        cost += 1
        if node['op'] not in level['commands']:
            raise ValueError('COMMAND_NOT_ALLOWED')
        if node['op'] in PRIMITIVES:
            output.append({'op': node['op'], 'nodeId': node['id'], 'topLevelIndex': index})
        elif node['op'] == 'repeat':
            if type(node['count']) is not int or not 2 <= node['count'] <= 5:
                raise ValueError('REPEAT_COUNT')
            if not node['body']:
                raise ValueError('REPEAT_BODY_EMPTY')
            if len(node['body']) > 6:
                raise ValueError('REPEAT_BODY_LIMIT')
            for child in node['body']:
                if child['op'] == 'repeat':
                    raise ValueError('NESTED_REPEAT')
                if child['op'] not in PRIMITIVES or child['op'] not in level['commands']:
                    raise ValueError('COMMAND_NOT_ALLOWED')
                if child['id'] in ids:
                    raise ValueError('DUPLICATE_NODE_ID')
                ids.add(child['id'])
                cost += 1
            for iteration in range(1, node['count'] + 1):
                for child in node['body']:
                    output.append({'op': child['op'], 'nodeId': child['id'], 'topLevelIndex': index, 'iteration': iteration})
        else:
            raise ValueError('UNKNOWN_COMMAND')
        if len(output) > 256:
            raise ValueError('EXPANSION_LIMIT')
    if cost > 24 or cost > level['limits']['maxBlocks']:
        raise ValueError('BLOCK_LIMIT')
    return output, cost


def simulate(level: dict[str, Any], program: dict[str, Any]) -> dict[str, Any]:
    validate_level(level)
    actions, cost = compile_program(program, level)
    tiles = {xy(p) for p in level['board']['tiles']}
    walls = {xy(p) for p in level['board']['walls']}
    gates = {xy(g): g['id'] for g in level['gates']}
    switches = {xy(s): s for s in level['switches']}
    pickups = {xy(p): p for p in level['collectibles']}
    required = {p['id'] for p in level['collectibles'] if p['kind'] == 'required'}
    bonuses = {p['id'] for p in level['collectibles'] if p['kind'] == 'bonus'}
    collected: set[str] = set()
    opened: set[str] = set()
    state = {**level['start'], 'collected': [], 'openedGates': [], 'actionsUsed': 0}
    initial = deepcopy(state)
    steps: list[dict[str, Any]] = []
    outcome = 'incomplete'
    for action_index, source in enumerate(actions):
        if state['actionsUsed'] >= level['limits']['maxActions']:
            outcome = 'out_of_actions'
            break
        before = deepcopy(state)
        state['actionsUsed'] += 1
        events: list[dict[str, str]] = []
        blocked = None
        op = source['op']
        if op in ('left', 'right'):
            direction = DIRECTIONS.index(state['facing'])
            state['facing'] = DIRECTIONS[(direction + (1 if op == 'right' else -1)) % 4]
        else:
            dx, dy = DELTAS[state['facing']]
            target = (state['x'] + dx, state['y'] + dy)
            reason = ('void' if target not in tiles else 'wall' if target in walls else
                      'closed_gate' if target in gates and gates[target] not in opened else None)
            if reason:
                blocked = {'target': {'x': target[0], 'y': target[1]}, 'reason': reason}
                outcome = 'blocked'
            else:
                state['x'], state['y'] = target
                pickup = pickups.get(target)
                if pickup and pickup['id'] not in collected:
                    collected.add(pickup['id'])
                    events.append({'kind': 'collect', 'id': pickup['id']})
                switch = switches.get(target)
                if switch:
                    for gate_id in sorted(switch['opens']):
                        if gate_id not in opened:
                            opened.add(gate_id)
                            events.append({'kind': 'open_gate', 'id': gate_id})
        state['collected'], state['openedGates'] = sorted(collected), sorted(opened)
        step = {'actionIndex': action_index, 'source': deepcopy(source), 'before': before, 'after': deepcopy(state), 'events': events}
        if blocked:
            step['blocked'] = blocked
        steps.append(step)
        if blocked:
            break
        if xy(state) == xy(level['goal']) and required <= collected:
            outcome = 'success'
            break
    success = outcome == 'success'
    return {'initial': initial, 'steps': steps, 'final': deepcopy(state), 'outcome': outcome,
            'usedBlocks': cost, 'awards': {'completion': success, 'bonus': success and bonuses <= collected,
                                         'efficiency': success and cost <= level['rating']['parBlocks']}}
