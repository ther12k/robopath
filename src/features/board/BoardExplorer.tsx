import React from 'react';
import { Level, State } from '../../core/model';
import { Dialog } from '../../ui/Dialog';

export interface BoardExplorerProps {
  isOpen: boolean;
  level: Level;
  currentState: State;
  onClose: () => void;
}

export const BoardExplorer: React.FC<BoardExplorerProps> = ({
  isOpen,
  level,
  currentState,
  onClose,
}) => {
  const { board, goal, collectibles, gates, switches } = level;
  const wallSet = new Set(board.walls.map((w) => `${w.x},${w.y}`));
  const tileSet = new Set(board.tiles.map((t) => `${t.x},${t.y}`));
  const collectedSet = new Set(currentState.collected);
  const openGateSet = new Set(currentState.openedGates);

  const getCellDescription = (x: number, y: number): string => {
    const key = `${x},${y}`;
    if (!tileSet.has(key)) return 'Empty void (impassable)';
    if (wallSet.has(key)) return 'Solid stone wall (blocked)';

    const parts: string[] = ['Walkable tile'];

    if (currentState.x === x && currentState.y === y) {
      parts.push(`Robot here facing ${currentState.facing}`);
    }

    if (goal.x === x && goal.y === y) {
      parts.push('Goal Flag 🏁');
    }

    const item = collectibles.find((c) => c.x === x && c.y === y);
    if (item) {
      if (collectedSet.has(item.id)) {
        parts.push(`Collected ${item.kind === 'required' ? 'Battery' : 'Star'}`);
      } else {
        parts.push(`Uncollected ${item.kind === 'required' ? 'Required Battery ⚡' : 'Bonus Star ⭐'}`);
      }
    }

    const sw = switches.find((s) => s.x === x && s.y === y);
    if (sw) {
      parts.push(`Switch pad (opens gates: ${sw.opens.join(', ')})`);
    }

    const gate = gates.find((g) => g.x === x && g.y === y);
    if (gate) {
      parts.push(openGateSet.has(gate.id) ? `Gate ${gate.id} (OPEN)` : `Gate ${gate.id} (CLOSED)`);
    }

    return parts.join(', ');
  };

  return (
    <Dialog isOpen={isOpen} title="Accessible Board Explorer" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
          Linear grid explorer describing board coordinates, robot facing, items, switches, and gates for screen readers and keyboard review.
        </p>

        <div
          role="table"
          aria-label="Board grid coordinates"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            maxHeight: '360px',
            overflowY: 'auto',
            padding: '4px',
          }}
        >
          {Array.from({ length: board.height }, (_, y) =>
            Array.from({ length: board.width }, (_, x) => {
              const key = `${x},${y}`;
              const desc = getCellDescription(x, y);
              const isRobotTile = currentState.x === x && currentState.y === y;

              return (
                <div
                  key={key}
                  role="row"
                  tabIndex={0}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isRobotTile ? 'var(--color-sky)' : 'var(--color-surface-soft)',
                    border: isRobotTile ? '2px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  <span style={{ fontWeight: 700, minWidth: '60px' }}>({x}, {y})</span>
                  <span>{desc}</span>
                </div>
              );
            }),
          )}
        </div>
      </div>
    </Dialog>
  );
};
