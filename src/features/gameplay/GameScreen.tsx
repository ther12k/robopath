import React, { useState, useEffect, useReducer, useRef } from 'react';
import { Level, RunTrace, State, Step } from '../../core/model';
import { PlaybackState } from '../../bridge/messages';
import { M1_LEVELS } from '../../content/levels';
import { editorReducer, createInitialEditorState } from '../editor/editorReducer';
import { RunController } from './RunController';
import { ProgramEditor } from '../editor/ProgramEditor';
import { PlaybackControls } from './PlaybackControls';
import { ResultPanel } from './ResultPanel';
import { HintModal } from './HintModal';
import { BoardExplorer } from '../board/BoardExplorer';
import { TutorialCoach } from '../tutorial/TutorialCoach';
import { PhaserGame } from '../../renderer/PhaserGame';
import { GameScene } from '../../renderer/GameScene';
import { IconButton } from '../../ui/IconButton';
import { Chip } from '../../ui/Chip';
import { PlayerProgress, recordLevelSuccess } from '../../core/progression';
import { StorageAdapter } from '../../storage/storageAdapter';
import { t } from '../../content/locales';
import { useGameAudio } from '../../ui/useGameAudio';

export interface GameScreenProps {
  levelId: string;
  progress: PlayerProgress;
  storage: StorageAdapter;
  onUpdateProgress: (progress: PlayerProgress) => void;
  onBackToMap: () => void;
  onSelectLevel: (levelId: string) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  levelId,
  progress,
  storage,
  onUpdateProgress,
  onBackToMap,
  onSelectLevel,
}) => {
  const currentLevelIndex = Math.max(
    0,
    M1_LEVELS.findIndex((l) => l.id === levelId),
  );
  const level: Level = M1_LEVELS[currentLevelIndex] || M1_LEVELS[0];

  const [editorState, dispatch] = useReducer(
    editorReducer,
    createInitialEditorState(level.limits.maxBlocks),
  );

  const [playbackState, setPlaybackState] = useState<PlaybackState>('editing');
  const [activeStep, setActiveStep] = useState<Step | null>(null);
  const [currentState, setCurrentState] = useState<State>({
    ...level.start,
    collected: [],
    openedGates: [],
    actionsUsed: 0,
  });
  const [lastTrace, setLastTrace] = useState<RunTrace | null>(null);
  const audio = useGameAudio();

  const [isHintOpen, setIsHintOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const controllerRef = useRef<RunController | null>(null);
  const sceneRef = useRef<GameScene | null>(null);

  // Initialize or update RunController when level changes
  useEffect(() => {
    const controller = new RunController(level, progress.selectedRobotId);
    controllerRef.current = controller;

    const unsubscribe = controller.subscribe({
      onStateChange: (state) => setPlaybackState(state),
      onStepChange: (_idx, step, state) => {
        setActiveStep(step);
        setCurrentState(state);
      },
      onTraceComplete: (trace) => {
        setLastTrace(trace);
        if (trace.outcome === 'success') {
          audio.win();
          // Durable transactional progress write
          const updated = recordLevelSuccess(
            progress,
            level.id,
            trace.awards,
            trace.usedBlocks,
            trace.final.actionsUsed,
          );
          onUpdateProgress(updated);
          storage.saveProgress(updated).catch(console.error);
        } else {
          audio.fail();
        }
      },
      onSendMessage: (msg) => {
        sceneRef.current?.handleMessage(msg);
      },
    });

    // Load saved draft if exists
    storage.loadDraft(level.id).then((savedDraft) => {
      if (savedDraft && savedDraft.length > 0) {
        dispatch({ type: 'SET_COMMANDS', commands: savedDraft, resetHistory: true });
      } else {
        dispatch({ type: 'CLEAR_COMMANDS' });
      }
    });

    // Show tutorial if not seen yet
    if (!progress.tutorialSeen.includes(level.teaching.concept)) {
      setIsTutorialOpen(true);
      const nextProgress: PlayerProgress = {
        ...progress,
        tutorialSeen: [...progress.tutorialSeen, level.teaching.concept],
      };
      onUpdateProgress(nextProgress);
      storage.saveProgress(nextProgress).catch(console.error);
    }

    return () => {
      unsubscribe();
      controller.destroy();
    };
  }, [level.id, progress.selectedRobotId]);

  // Debounced draft save
  useEffect(() => {
    if (editorState.commands.length > 0) {
      const timer = setTimeout(() => {
        storage.saveDraft(level.id, editorState.commands).catch(console.error);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [editorState.commands, level.id]);

  const handleRun = () => {
    const program = {
      schemaVersion: 1 as const,
      engineRulesVersion: 1 as const,
      commands: editorState.commands,
    };
    audio.run();
    controllerRef.current?.run(program);
  };

  const handlePause = () => controllerRef.current?.pause();
  const handleResume = () => controllerRef.current?.resume();
  const handleStep = () => controllerRef.current?.step();
  const handleReset = () => {
    controllerRef.current?.reset();
    setLastTrace(null);
    setActiveStep(null);
    setCurrentState({
      ...level.start,
      collected: [],
      openedGates: [],
      actionsUsed: 0,
    });
  };

  const handleNextLevel = () => {
    handleReset();
    if (currentLevelIndex + 1 < M1_LEVELS.length) {
      onSelectLevel(M1_LEVELS[currentLevelIndex + 1].id);
    } else {
      onBackToMap();
    }
  };

  const requiredItemCount = level.collectibles.filter((c) => c.kind === 'required').length;
  const collectedRequired = currentState.collected.filter((id) => {
    const item = level.collectibles.find((c) => c.id === id);
    return item?.kind === 'required';
  }).length;

  const bonusItemCount = level.collectibles.filter((c) => c.kind === 'bonus').length;
  const collectedBonus = currentState.collected.filter((id) => {
    const item = level.collectibles.find((c) => c.id === id);
    return item?.kind === 'bonus';
  }).length;

  return (
    <div
      className="rp-sky-gradient rp-game-shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        margin: '0 auto',
        padding: '12px 16px calc(12px + var(--sab))',
        boxSizing: 'border-box',
        gap: '8px',
        position: 'relative',
      }}
    >
      {/* Top Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconButton
            label="Back to level map"
            size="md"
            variant="secondary"
            onClick={onBackToMap}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            }
          />
          <div>
            <h1 style={{ margin: 0, fontSize: 'var(--text-lg)', color: 'var(--color-ink)' }}>
              {t(level.titleKey)}
            </h1>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', fontWeight: 600 }}>
              Level {level.ordinal}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {requiredItemCount > 0 && (
            <Chip
              label="⚡"
              value={`${collectedRequired}/${requiredItemCount}`}
              variant="primary"
            />
          )}
          {bonusItemCount > 0 && (
            <Chip
              label="⭐"
              value={`${collectedBonus}/${bonusItemCount}`}
              variant="accent"
            />
          )}
          <IconButton
            label="Open Board Explorer"
            size="md"
            variant="ghost"
            onClick={() => setIsExplorerOpen(true)}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            }
          />
          <IconButton
            label="Gentle Hints"
            size="md"
            variant="ghost"
            onClick={() => setIsHintOpen(true)}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            }
          />
        </div>
      </header>

      {/* Main Game Area: Isometric Canvas */}
      <div className="rp-game-layout" style={{ flex: 1, minHeight: 0 }}>
        <main className="rp-board-stage">
          <PhaserGame
            level={level}
            robotId={progress.selectedRobotId}
            currentState={currentState}
            onAcknowledgment={(ack) => controllerRef.current?.acknowledge(ack)}
            onMountScene={(scene) => {
              sceneRef.current = scene;
            }}
          />
        </main>

      {/* Bottom Area: Program Editor & Playback Controls */}
      <footer style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
        <ProgramEditor
          commands={editorState.commands}
          allowedCommands={level.commands}
          maxBlocks={level.limits.maxBlocks}
          activeNodeId={activeStep?.source.nodeId}
          activeIteration={activeStep?.source.iteration}
          disabled={playbackState === 'running' || playbackState === 'paused'}
          onAddCommand={(op) => dispatch({ type: 'ADD_COMMAND', op })}
          onDeleteCommand={(idx) => dispatch({ type: 'DELETE_COMMAND', index: idx })}
          onClearCommands={() => dispatch({ type: 'CLEAR_COMMANDS' })}
          onUndo={() => dispatch({ type: 'UNDO' })}
          onRedo={() => dispatch({ type: 'REDO' })}
          canUndo={editorState.undoStack.length > 0}
          canRedo={editorState.redoStack.length > 0}
          onAddToRepeat={(repeatIndex, op) => dispatch({ type: 'ADD_TO_REPEAT', repeatIndex, op })}
          onRemoveFromRepeat={(repeatIndex, childIndex) => dispatch({ type: 'REMOVE_FROM_REPEAT', repeatIndex, childIndex })}
          onChangeRepeatCount={(repeatIndex, count) => dispatch({ type: 'CHANGE_REPEAT_COUNT', repeatIndex, count })}
        />

        <PlaybackControls
          playbackState={playbackState}
          hasCommands={editorState.commands.length > 0}
          onRun={handleRun}
          onPause={handlePause}
          onResume={handleResume}
          onStep={handleStep}
          onReset={handleReset}
        />
      </footer>
      </div>

      {/* Modals & Dialogs */}
      <HintModal
        isOpen={isHintOpen}
        level={level}
        onClose={() => setIsHintOpen(false)}
      />

      <BoardExplorer
        isOpen={isExplorerOpen}
        level={level}
        currentState={currentState}
        onClose={() => setIsExplorerOpen(false)}
      />

      <TutorialCoach
        isOpen={isTutorialOpen}
        concept={level.teaching.concept}
        onClose={() => setIsTutorialOpen(false)}
      />

      {/* Result Panel Overlay */}
      {(playbackState === 'success' || playbackState === 'retry') && lastTrace && (
        <ResultPanel
          level={level}
          robotId={progress.selectedRobotId}
          trace={lastTrace}
          hasNextLevel={currentLevelIndex + 1 < M1_LEVELS.length}
          onNextLevel={handleNextLevel}
          onRetry={handleReset}
          onBackToMap={onBackToMap}
        />
      )}
    </div>
  );
};
