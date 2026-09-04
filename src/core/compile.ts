import { CompiledAction, Level, Program } from './model';

export function compileProgram(
  program: Program,
  _level: Level,
): { actions: CompiledAction[]; cost: number } {
  const actions: CompiledAction[] = [];
  let cost = 0;

  for (let index = 0; index < program.commands.length; index++) {
    const node = program.commands[index];
    cost++;

    if (node.op === 'forward' || node.op === 'left' || node.op === 'right') {
      actions.push({
        op: node.op,
        nodeId: node.id,
        topLevelIndex: index,
      });
    } else if (node.op === 'repeat') {
      for (let i = 0; i < node.body.length; i++) {
        cost++;
      }
      for (let iteration = 1; iteration <= node.count; iteration++) {
        for (const child of node.body) {
          actions.push({
            op: child.op,
            nodeId: child.id,
            topLevelIndex: index,
            iteration,
          });
        }
      }
    }
  }

  return { actions, cost };
}
