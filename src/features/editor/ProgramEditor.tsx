import React from 'react';
import { CommandOp, Node } from '../../core/model';
import { calculateBlockCost } from './editorReducer';
import { IconButton } from '../../ui/IconButton';
import { Chip } from '../../ui/Chip';

export interface ProgramEditorProps {
  commands: readonly Node[];
  allowedCommands: readonly CommandOp[];
  maxBlocks: number;
  activeNodeId?: string;
  activeIteration?: number;
  disabled?: boolean;
  onAddCommand: (op: CommandOp) => void;
  onDeleteCommand: (index: number) => void;
  onClearCommands: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const ProgramEditor: React.FC<ProgramEditorProps> = ({
  commands,
  allowedCommands,
  maxBlocks,
  activeNodeId,
  activeIteration,
  disabled = false,
  onAddCommand,
  onDeleteCommand,
  onClearCommands,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const currentCost = calculateBlockCost(commands);
  const isAtCapacity = currentCost >= maxBlocks || commands.length >= 24;

  const renderCommandIcon = (op: CommandOp) => {
    switch (op) {
      case 'forward':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        );
      case 'left':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 14L4 9l5-5" />
            <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v2" />
          </svg>
        );
      case 'right':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14l5-5-5-5" />
            <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v2" />
          </svg>
        );
      case 'repeat':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        );
    }
  };

  const getCommandColor = (op: CommandOp): { bg: string; text: string } => {
    switch (op) {
      case 'forward':
        return { bg: 'var(--color-primary)', text: '#ffffff' };
      case 'left':
      case 'right':
        return { bg: 'var(--color-action)', text: '#ffffff' };
      case 'repeat':
        return { bg: 'var(--color-purple)', text: '#ffffff' };
    }
  };

  return (
    <section
      aria-label="Program Editor"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-panel)',
        padding: '16px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Editor Header: Capacity & Undo/Redo/Clear Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Chip
            label="Blocks"
            value={`${currentCost} / ${maxBlocks}`}
            variant={isAtCapacity ? 'coral' : 'accent'}
          />
          {disabled && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', fontWeight: 600 }}>
              (Playing)
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <IconButton
            label="Undo command"
            size="md"
            variant="ghost"
            disabled={!canUndo || disabled}
            onClick={onUndo}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 14 4 9 9 4" />
                <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
              </svg>
            }
          />
          <IconButton
            label="Redo command"
            size="md"
            variant="ghost"
            disabled={!canRedo || disabled}
            onClick={onRedo}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 14 20 9 15 4" />
                <path d="M4 20v-7a4 4 0 0 1 4-4h16" />
              </svg>
            }
          />
          <IconButton
            label="Clear program"
            size="md"
            variant="ghost"
            disabled={commands.length === 0 || disabled}
            onClick={onClearCommands}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Program Strip: Ordered sequence of blocks */}
      <div
        role="region"
        aria-label="Program sequence"
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          minHeight: '60px',
          padding: '8px 4px',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface-soft)',
          borderRadius: 'var(--radius-tile)',
          border: '2px dashed var(--color-border)',
        }}
      >
        {commands.length === 0 ? (
          <div
            style={{
              padding: '12px',
              color: 'var(--color-muted)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              textAlign: 'center',
              width: '100%',
            }}
          >
            Tap command buttons below to add to your program
          </div>
        ) : (
          commands.map((cmd, idx) => {
            const isActive = activeNodeId === cmd.id;
            const colors = getCommandColor(cmd.op);

            return (
              <div
                key={cmd.id}
                role="group"
                aria-label={`Slot ${idx + 1}, ${cmd.op}`}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '52px',
                  height: '52px',
                  padding: '0 8px',
                  borderRadius: 'var(--radius-tile)',
                  backgroundColor: colors.bg,
                  color: colors.text,
                  boxShadow: isActive ? '0 0 0 4px var(--color-accent)' : 'var(--shadow-sm)',
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  flexShrink: 0,
                  cursor: disabled ? 'default' : 'pointer',
                  userSelect: 'none',
                }}
                onClick={() => {
                  if (!disabled) onDeleteCommand(idx);
                }}
                title={disabled ? undefined : 'Tap to remove'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {renderCommandIcon(cmd.op)}
                  {cmd.op === 'repeat' && (
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800 }}>
                      ×{cmd.count}
                    </span>
                  )}
                </div>

                {/* Slot index label */}
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '-4px',
                    backgroundColor: 'var(--color-ink)',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-hidden="true"
                >
                  {idx + 1}
                </span>

                {/* Active iteration badge if in repeat */}
                {isActive && activeIteration && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-6px',
                      right: '-4px',
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-ink)',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '8px',
                    }}
                    aria-hidden="true"
                  >
                    #{activeIteration}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Command Palette */}
      <div
        role="toolbar"
        aria-label="Available commands"
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          paddingTop: '4px',
        }}
      >
        {allowedCommands.map((op) => {
          const colors = getCommandColor(op);
          const isButtonDisabled = disabled || isAtCapacity;

          return (
            <button
              key={op}
              role="button"
              aria-label={`Add ${op} command`}
              disabled={isButtonDisabled}
              onClick={() => onAddCommand(op)}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-tile)',
                backgroundColor: colors.bg,
                color: colors.text,
                border: 'none',
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                opacity: isButtonDisabled ? 0.4 : 1,
                boxShadow: isButtonDisabled ? 'none' : 'var(--shadow-md)',
                transform: 'translateY(0)',
                transition: 'transform 0.1s ease, filter 0.1s ease',
                WebkitTapHighlightColor: 'transparent',
                outline: 'none',
              }}
            >
              {renderCommandIcon(op)}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  marginTop: '2px',
                  textTransform: 'capitalize',
                }}
              >
                {op}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
