import React from 'react';
import { motion } from 'framer-motion';
import { PlayerProgress } from '../../core/progression';
import { getRobotById } from '../robots/robotCatalog';
import { Button } from '../../ui/Button';
import { IconButton } from '../../ui/IconButton';
import { KitImage, ROBOT_FRONT } from '../../ui/KitImage';

export interface WelcomeScreenProps {
  progress: PlayerProgress;
  onPlay: () => void;
  onChooseRobot: () => void;
  onOpenSettings: () => void;
}

/**
 * Scene-led welcome (audit RPUX-003): the meadow world and the chosen robot
 * are the hero. Copy is minimal; controls sit quietly at the bottom.
 */
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
        height: '100dvh',
        margin: '0 auto',
        padding: '16px 20px calc(20px + var(--sab))',
        boxSizing: 'border-box',
        maxWidth: '560px',
        width: '100%',
      }}
    >
      {/* Sky: drifting clouds */}
      <div className="rp-cloud" style={{ width: 150, height: 42, top: '9%', left: '-34px' }} aria-hidden="true" />
      <div className="rp-cloud" style={{ width: 100, height: 30, top: '17%', right: '-18px', opacity: 0.75 }} aria-hidden="true" />
      <div className="rp-cloud" style={{ width: 120, height: 34, top: '38%', right: '8%', opacity: 0.5 }} aria-hidden="true" />

      {/* Header: settings only — everything else belongs to the scene */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', zIndex: 2 }}>
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

      {/* Scene: floating meadow island carrying the chosen robot */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          minHeight: 0,
        }}
        aria-hidden="true"
      >
        {/* Island (gentle ambient bob; disabled by reducedMotion="user") */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.5 },
            y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{ position: 'absolute', inset: 0 }}
        >
        <div
          style={{
            position: 'absolute',
            bottom: '6%',
            width: '78%',
            maxWidth: '380px',
            height: '110px',
            borderRadius: '50% 50% 46% 46% / 64% 64% 36% 36%',
            background: 'linear-gradient(180deg, #9be267 0%, #7cc44e 58%, #5f9e3b 100%)',
            boxShadow: '0 22px 30px rgba(36, 111, 229, 0.18)',
          }}
        />
        {/* Island underside (floating-earth taper) */}
        <div
          style={{
            position: 'absolute',
            bottom: '1%',
            width: '46%',
            maxWidth: '220px',
            height: '52px',
            borderRadius: '0 0 48% 48% / 0 0 90% 90%',
            background: 'linear-gradient(180deg, #8a6a4a 0%, #6d5138 100%)',
            opacity: 0.92,
          }}
        />
        {/* Flag on the island */}
        <KitImage
          src="world/flag.svg"
          alt=""
          size={64}
          style={{ position: 'absolute', bottom: '34%', right: '22%' }}
        />
        {/* Chosen robot, standing on the island */}
        <div style={{ position: 'absolute', bottom: '24%', left: '18%' }}>
          <div className="rp-hero-blob" style={{ display: 'flex' }}>
            <KitImage
              src={ROBOT_FRONT[robot.id] ?? ROBOT_FRONT.pip}
              alt={`${robot.name} robot on a floating meadow island`}
              size={150}
            />
          </div>
        </div>
        </motion.div>
      </div>

      {/* Title + actions: quiet, over the scene's lower edge */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          zIndex: 2,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '2.4rem',
            color: 'var(--color-ink)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          Robo Paths
        </h1>

        {/* The chosen robot doubles as the change-robot control */}
        <button
          className="rp-card-hover"
          onClick={onChooseRobot}
          aria-label={`Playing as ${robot.name}. Choose a different robot.`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--color-surface)',
            border: '2px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-pill)',
            padding: '8px 16px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
          }}
        >
          <KitImage src={`robots/avatars/${robot.id}-avatar.svg`} alt="" size={32} />
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-ink)' }}>
            {robot.name}
          </span>
          <span
            aria-hidden="true"
            style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 700 }}
          >
            change ↻
          </span>
        </button>

        <Button variant="action" size="lg" fullWidth className="rp-press" onClick={onPlay}>
          {hasProgress ? 'Continue Adventure →' : 'Start Playing! →'}
        </Button>
      </div>
    </div>
  );
};
