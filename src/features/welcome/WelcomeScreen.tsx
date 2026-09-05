import React from 'react';
import { PlayerProgress } from '../../core/progression';
import { RobotAvatar } from '../robots/RobotAvatar';
import { getRobotById } from '../robots/robotCatalog';
import { Button } from '../../ui/Button';
import { IconButton } from '../../ui/IconButton';

export interface WelcomeScreenProps {
  progress: PlayerProgress;
  onPlay: () => void;
  onChooseRobot: () => void;
  onOpenSettings: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  progress,
  onPlay,
  onChooseRobot,
  onOpenSettings,
}) => {
  const robot = getRobotById(progress.selectedRobotId);
  const hasProgress = progress.completedLevels.length > 0;

  return (
    <div
      className="rp-sky-gradient"
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100dvh',
        maxWidth: '480px',
        margin: '0 auto',
        padding: '32px 24px calc(32px + var(--sab))',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      {/* Decorative floating clouds */}
      <div className="rp-cloud" style={{ width: 130, height: 38, top: '12%', left: '-30px' }} aria-hidden="true" />
      <div className="rp-cloud" style={{ width: 90, height: 28, top: '22%', right: '-14px', opacity: 0.7 }} aria-hidden="true" />
      <div className="rp-cloud" style={{ width: 160, height: 44, bottom: '26%', left: '-40px', opacity: 0.6 }} aria-hidden="true" />

      {/* Top Bar: Settings Button */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', zIndex: 1 }}>
        <IconButton
          label="Settings and Grown-Up Area"
          variant="secondary"
          size="md"
          onClick={onOpenSettings}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          }
        />
      </div>

      {/* Hero Section: Title & Robot Avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 1 }}>
        <div>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: '#dbeafe',
              color: 'var(--color-primary)',
              fontWeight: 800,
              fontSize: 'var(--text-xs)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Coding Puzzle Toy
          </span>
          <h1
            style={{
              margin: 0,
              fontSize: '2.5rem',
              color: 'var(--color-ink)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            Robo Paths
          </h1>
          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: 'var(--text-base)',
              color: 'var(--color-muted)',
              lineHeight: 1.4,
            }}
          >
            Guide your robot through floating puzzles using simple command blocks!
          </p>
        </div>

        {/* Robot Hero Avatar Card */}
        <button
          className="rp-card-hover"
          onClick={onChooseRobot}
          aria-label={`Current robot: ${robot.name}. Click to change.`}
          style={{
            background: 'var(--color-surface)',
            border: '2px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-panel)',
            padding: '24px 32px',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            outline: 'none',
            marginTop: '12px',
          }}
        >
          <div className="rp-hero-blob" style={{ display: 'flex' }}>
            <RobotAvatar robotId={robot.id} size={110} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', color: 'var(--color-ink)' }}>
              {robot.name}
            </h2>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 700 }}>
              Tap to switch robot ↻
            </span>
          </div>
        </button>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', zIndex: 1 }}>
        <Button variant="action" size="lg" fullWidth className="rp-press" onClick={onPlay}>
          {hasProgress ? 'Continue Adventure →' : 'Start Playing! →'}
        </Button>
        <Button variant="secondary" size="md" fullWidth className="rp-press" onClick={onChooseRobot}>
          Choose Another Robot
        </Button>
      </div>
    </div>
  );
};
