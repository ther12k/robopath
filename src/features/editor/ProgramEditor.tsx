import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CommandOp, Node, PrimitiveOp, Repeat } from '../../core/model';
import { calculateBlockCost } from './editorReducer';
import { IconButton } from '../../ui/IconButton';
import { Chip } from '../../ui/Chip';
import { KitImage, BLOCK_ICON } from '../../ui/KitImage';
import {
  DndContext,
  pointerWithin,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

export interface ProgramEditorProps {
  commands: readonly Node[];
  allowedCommands: readonly CommandOp[];
  maxBlocks: number;
  activeNodeId?: string;
  activeIteration?: number;
  disabled?: boolean;
  onAddCommand: (op: CommandOp) => void;
  /** Reorder existing commands (drag), not charged as add. */
  onReorderCommand?: (fromIndex: number, toIndex: number) => void;
  onDeleteCommand: (index: number) => void;
  onClearCommands: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onAddToRepeat?: (repeatIndex: number, op: PrimitiveOp) => void;
  onRemoveFromRepeat?: (repeatIndex: number, childIndex: number) => void;
  onChangeRepeatCount?: (repeatIndex: number, count: 2 | 3 | 4 | 5) => void;
}


/** Draggable wrapper that keeps children tappable/keyboard-operable. */
interface PaletteDraggableProps {
  op: CommandOp;
  disabled: boolean;
  children: React.ReactNode;
}
const PaletteDraggable: React.FC<PaletteDraggableProps> = ({ op, disabled, children }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${op}`,
    disabled,
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ touchAction: 'none', opacity: isDragging ? 0.4 : 1, display: 'inline-flex' }}
    >
      {children}
    </div>
  );
};

/** Droppable insertion point (program end). */
interface SlotDropZoneProps {
  id: string;
  disabled: boolean;
  children: React.ReactNode;
}
const SlotDropZone: React.FC<SlotDropZoneProps> = ({ id, disabled, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id, disabled });
  return (
    <div
      ref={setNodeRef}
      style={{
        minWidth: '10px',
        alignSelf: 'stretch',
        borderRadius: '8px',
        backgroundColor: isOver && !disabled ? 'rgba(36, 111, 229, 0.16)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  );
};

/** Primitive command block: draggable to reorder, tappable to remove. */
interface PrimitiveBlockProps {
  idx: number;
  op: CommandOp;
  active: boolean;
  hasKitArt: boolean;
  disabled: boolean;
  onRemove: () => void;
  children: React.ReactNode;
}
const PrimitiveBlock: React.FC<PrimitiveBlockProps> = ({
  idx,
  op,
  active,
  hasKitArt,
  disabled,
  onRemove,
  children,
}) => {
  const drag = useDraggable({ id: `cmd:${idx}`, disabled });
  // The block itself is the drop target (insert before this block).
  const drop = useDroppable({ id: `slot-${idx}`, disabled });
  const colors = getCommandColor(op);
  return (
      <div
        ref={(node) => {
          drag.setNodeRef(node);
          drop.setNodeRef(node);
        }}
        {...drag.listeners}
        {...drag.attributes}
          role="group"
          aria-label={`Slot ${idx + 1}, ${op}`}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '52px',
            height: '52px',
            padding: '0 8px',
            borderRadius: 'var(--radius-tile)',
            backgroundColor: hasKitArt ? 'transparent' : colors.bg,
            color: colors.text,
            outline: drop.isOver && !disabled ? '3px dashed var(--color-primary)' : undefined,
            boxShadow: active ? '0 0 0 4px var(--color-accent)' : 'var(--shadow-sm)',
            transform: active ? 'scale(1.08)' : drag.isDragging ? 'scale(0.92)' : 'scale(1)',
            opacity: drag.isDragging ? 0.4 : 1,
            touchAction: 'none',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            flexShrink: 0,
            cursor: disabled ? 'default' : 'grab',
            userSelect: 'none',
          }}
          onClick={onRemove}
          title={disabled ? undefined : 'Drag to move · tap to remove'}
        >
          {/* Pop-in on mount (new blocks); key stability means reorders never replay it. */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            style={{ display: 'flex' }}
          >
            {children}
          </motion.div>
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
        </div>
    );
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

export const ProgramEditor: React.FC<ProgramEditorProps> = ({
  commands,
  allowedCommands,
  maxBlocks,
  activeNodeId,
  activeIteration,
  disabled = false,
  onAddCommand,
  onReorderCommand,
  onDeleteCommand,
  onClearCommands,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onAddToRepeat,
  onRemoveFromRepeat,
  onChangeRepeatCount,
}) => {
  const currentCost = calculateBlockCost(commands);
  const isAtCapacity = currentCost >= maxBlocks || commands.length >= 24;
  const [dragOp, setDragOp] = useState<CommandOp | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (disabled) return;
    setDragOp(String(event.active.id).replace('palette-', '') as CommandOp);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const op = String(event.active.id).replace('palette-', '') as CommandOp;
    setDragOp(null);
    if (disabled) return;
    const overId = event.over?.id ? String(event.over.id) : null;
    if (!overId) return; // dropped outside any valid target → cancel, no mutation

    if (overId === 'program-end') {
      if (!isAtCapacity) onAddCommand(op);
      return;
    }
    const slotMatch = overId.match(/^slot-(\d+)$/);
    if (slotMatch) {
      const slot = Number(slotMatch[1]);
      const isReorder = op.startsWith('cmd:');
      if (isReorder) {
        const from = Number(op.slice(4));
        if (onReorderCommand && from !== slot && from !== slot - 1) {
          onReorderCommand(from, slot < from ? slot : slot - 1);
        }
      } else if (!isAtCapacity) {
        // Insert at the slot position via undoable add + reorder.
        onAddCommand(op);
        const newIndex = commands.length;
        if (onReorderCommand && slot < newIndex) {
          onReorderCommand(newIndex, slot);
        }
      }
    }
  };

  const renderCommandIcon = (op: CommandOp, size = 22) => {
    const kitSrc = BLOCK_ICON[op];
    if (kitSrc) {
      // Kit block art already includes its colored tile; render full-bleed.
      if (size >= 48) {
        return <KitImage src={kitSrc} alt="" size={size} style={{ pointerEvents: 'none' }} />;
      }
      return <KitImage src={kitSrc} alt="" size={size + 6} style={{ margin: -3, pointerEvents: 'none' }} />;
    }
    switch (op) {
      case 'forward':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        );
      case 'left':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 14L4 9l5-5" />
            <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v2" />
          </svg>
        );
      case 'right':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14l5-5-5-5" />
            <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v2" />
          </svg>
        );
      case 'repeat':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        );
    }
  };



  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setDragOp(null)}
    >
    <section
      aria-label="Program Editor"
      className="rp-editor-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
      }}
    >
      {/* Editor Header */}
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
        className="rp-command-strip"
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          minHeight: '64px',
          padding: '8px',
          alignItems: 'center',
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
            if (cmd.op === 'repeat') {
              const repeat = cmd as Repeat;
              const isRepeatActive = activeNodeId === repeat.id;

              return (
                <div
                  key={repeat.id}
                  role="group"
                  aria-label={`Slot ${idx + 1}, Repeat ${repeat.count} times`}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-tile)',
                    backgroundColor: '#ede9fe',
                    border: isRepeatActive ? '2px solid var(--color-purple)' : '1px solid #c4b5fd',
                    boxShadow: isRepeatActive ? '0 0 0 3px var(--color-accent)' : 'var(--shadow-sm)',
                    flexShrink: 0,
                  }}
                >
                  {/* Repeat Header & Count Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: 'var(--color-purple)', fontWeight: 800 }}>🔁 ×{repeat.count}</span>
                    {!disabled && onChangeRepeatCount && (
                      <button
                        aria-label="Cycle repeat count"
                        onClick={() => {
                          const nextCount = (repeat.count === 5 ? 2 : repeat.count + 1) as 2 | 3 | 4 | 5;
                          onChangeRepeatCount(idx, nextCount);
                        }}
                        style={{
                          background: 'var(--color-purple)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '2px 6px',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        +
                      </button>
                    )}
                  </div>

                  {/* Repeat Body primitives */}
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {repeat.body.map((child, childIdx) => {
                      const isChildActive = activeNodeId === child.id;
                      const childColors = getCommandColor(child.op);

                      return (
                        <button
                          key={child.id}
                          aria-label={`Repeat child ${childIdx + 1}, ${child.op}`}
                          disabled={disabled}
                          onClick={() => {
                            if (!disabled && onRemoveFromRepeat) onRemoveFromRepeat(idx, childIdx);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: childColors.bg,
                            color: childColors.text,
                            border: 'none',
                            cursor: disabled ? 'default' : 'pointer',
                            boxShadow: isChildActive ? '0 0 0 3px var(--color-accent)' : 'none',
                          }}
                          title={disabled ? undefined : 'Tap to remove'}
                        >
                          {renderCommandIcon(child.op, 16)}
                        </button>
                      );
                    })}

                    {/* Add primitive to repeat body button */}
                    {!disabled && onAddToRepeat && repeat.body.length < 6 && (
                      <button
                        aria-label="Add Forward to repeat body"
                        onClick={() => onAddToRepeat(idx, 'forward')}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: '1px dashed var(--color-purple)',
                          backgroundColor: 'transparent',
                          color: 'var(--color-purple)',
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                        title="Add action to loop"
                      >
                        +
                      </button>
                    )}
                  </div>

                  {/* Delete Repeat block */}
                  {!disabled && (
                    <button
                      aria-label="Delete repeat group"
                      onClick={() => onDeleteCommand(idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-muted)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '2px',
                      }}
                    >
                      ✕
                    </button>
                  )}

                  {/* Active iteration badge */}
                  {isRepeatActive && activeIteration && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-4px',
                        backgroundColor: 'var(--color-accent)',
                        color: 'var(--color-ink)',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '8px',
                      }}
                    >
                      {activeIteration} of {repeat.count}
                    </span>
                  )}
                </div>
              );
            }

            // Standard Primitive node — tap removes; drag reorders.
            const isActive = activeNodeId === cmd.id;
            const hasKitArt = Boolean(BLOCK_ICON[cmd.op]);

            return (
              <PrimitiveBlock
                key={cmd.id}
                idx={idx}
                op={cmd.op}
                active={isActive}
                hasKitArt={hasKitArt}
                disabled={disabled}
                onRemove={() => {
                  if (!disabled) onDeleteCommand(idx);
                }}
              >
                {renderCommandIcon(cmd.op, hasKitArt ? 52 : 22)}
              </PrimitiveBlock>
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
          const hasKitArt = Boolean(BLOCK_ICON[op]);

          return (
            <PaletteDraggable key={op} op={op} disabled={disabled}>
            <motion.button
              role="button"
              aria-label={`Add ${op} command. Drag into the program or press to add at the end.`}
              disabled={isButtonDisabled}
              onClick={() => onAddCommand(op)}
              whileHover={isButtonDisabled ? undefined : { scale: 1.06 }}
              whileTap={isButtonDisabled ? undefined : { scale: 0.9 }}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-tile)',
                // Kit art carries its own tile styling; avoid a tile-in-tile look.
                backgroundColor: hasKitArt ? 'transparent' : colors.bg,
                color: colors.text,
                border: 'none',
                cursor: isButtonDisabled ? 'not-allowed' : 'grab',
                opacity: isButtonDisabled ? 0.4 : 1,
                boxShadow: isButtonDisabled || hasKitArt ? 'none' : 'var(--shadow-md)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {renderCommandIcon(op, hasKitArt ? 46 : 22)}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  marginTop: '2px',
                  textTransform: 'capitalize',
                  // Kit-art buttons sit on the panel background, so use ink text.
                  color: hasKitArt ? 'var(--color-ink)' : colors.text,
                }}
              >
                {op}
              </span>
            </motion.button>
            </PaletteDraggable>
          );
        })}
      </div>

      {/* Drop target closing the program; also the miss-target cancel point. */}
      <SlotDropZone id="program-end" disabled={disabled}>
        <div style={{ width: '100%', height: '6px' }} />
      </SlotDropZone>

      {/* Floating preview of the dragged command */}
      <DragOverlay dropAnimation={null}>
        {dragOp ? (
          <div style={{ opacity: 0.9, display: 'flex' }}>
            {renderCommandIcon(dragOp, Boolean(BLOCK_ICON[dragOp]) ? 46 : 22)}
          </div>
        ) : null}
      </DragOverlay>
    </section>
    </DndContext>
  );
};
