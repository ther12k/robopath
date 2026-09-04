import React from 'react';
import { PlaybackState } from '../../bridge/messages';
import { Button } from '../../ui/Button';
import { IconButton } from '../../ui/IconButton';

export interface PlaybackControlsProps {
  playbackState: PlaybackState;
  hasCommands: boolean;
  onRun: () => void;
  onPause: () => void;
  onResume: () => void;
  onStep: () => void;
  onReset: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  playbackState,
  hasCommands,
  onRun,
  onPause,
  onResume,
  onStep,
  onReset,
}) => {
  const isRunning = playbackState === 'running';
  const isPaused = playbackState === 'paused';
  const isSuccess = playbackState === 'success';
  const isRetry = playbackState === 'retry';

  return (
    <div
      role="toolbar"
      aria-label="Playback controls"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        width: '100%',
      }}
    >
      {/* Reset button is always accessible */}
      <IconButton
        label="Reset to beginning"
        variant="secondary"
        size="lg"
        onClick={onReset}
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        }
      />

      {/* Main Play / Pause / Resume / Next Actions */}
      <div style={{ display: 'flex', flex: 1, gap: '10px' }}>
        {playbackState === 'editing' && (
          <Button
            variant="action"
            size="lg"
            fullWidth
            disabled={!hasCommands}
            onClick={onRun}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            }
          >
            Run Program
          </Button>
        )}

        {isRunning && (
          <Button
            variant="accent"
            size="lg"
            fullWidth
            onClick={onPause}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            }
          >
            Pause
          </Button>
        )}

        {isPaused && (
          <>
            <Button
              variant="action"
              size="lg"
              style={{ flex: 1 }}
              onClick={onResume}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              }
            >
              Resume
            </Button>
            <Button
              variant="primary"
              size="lg"
              style={{ flex: 1 }}
              onClick={onStep}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" />
                  <line x1="19" y1="5" x2="19" y2="19" />
                </svg>
              }
            >
              Step
            </Button>
          </>
        )}

        {(isSuccess || isRetry) && (
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={onReset}
          >
            Edit Program
          </Button>
        )}
      </div>
    </div>
  );
};
