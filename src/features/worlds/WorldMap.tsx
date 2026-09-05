import React, { useState } from 'react';
import { getLevelsForWorld } from '../../content/levels';
import { PlayerProgress, isLevelUnlocked } from '../../core/progression';
import { totalStars } from '../../core/score';
import { RobotAvatar } from '../robots/RobotAvatar';
import { IconButton } from '../../ui/IconButton';
import { t } from '../../content/locales';

export interface WorldMapProps {
  progress: PlayerProgress;
  onSelectLevel: (levelId: string) => void;
  onOpenRobotPicker: () => void;
  onOpenSettings: () => void;
}

export const WORLDS = [
  { id: 'w1', title: 'World 1 · Sunny Meadow', theme: 'Meadow', color: 'var(--color-action)' },
  { id: 'w2', title: 'World 2 · Pebble Workshop', theme: 'Workshop', color: 'var(--color-primary)' },
  { id: 'w3', title: 'World 3 · Crystal Grove', theme: 'Crystal', color: 'var(--color-purple)' },
  { id: 'w4', title: 'World 4 · Sky Isles', theme: 'Sky', color: 'var(--color-accent)' },
];

export const WorldMap: React.FC<WorldMapProps> = ({
  progress,
  onSelectLevel,
  onOpenRobotPicker,
  onOpenSettings,
}) => {
  const [selectedWorldId, setSelectedWorldId] = useState<string>('w1');
  const currentWorld = WORLDS.find((w) => w.id === selectedWorldId) || WORLDS[0];
  const worldLevels = getLevelsForWorld(selectedWorldId);

  const isWorldUnlocked = (wid: string): boolean => {
    if (wid === 'w1') return true;
    if (wid === 'w2') return progress.completedLevels.filter((id) => id.startsWith('w1-')).length >= 10;
    if (wid === 'w3') return progress.completedLevels.filter((id) => id.startsWith('w2-')).length >= 10;
    if (wid === 'w4') return progress.completedLevels.filter((id) => id.startsWith('w3-')).length >= 10;
    return false;
  };

  const totalWorldCompleted = progress.completedLevels.filter((id) => id.startsWith(`${selectedWorldId}-`)).length;

  return (
    <div
      className="rp-sky-gradient rp-map-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        maxWidth: '720px',
        margin: '0 auto',
        padding: '16px 16px calc(16px + var(--sab))',
        boxSizing: 'border-box',
        gap: '16px',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onOpenRobotPicker}
            aria-label="Change selected robot"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              borderRadius: '50%',
            }}
          >
            <RobotAvatar robotId={progress.selectedRobotId} size={52} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 'var(--text-xl)', color: 'var(--color-ink)' }}>
              {currentWorld.title}
            </h1>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', fontWeight: 600 }}>
              {totalWorldCompleted} / {worldLevels.length} Completed
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <IconButton
            label="Change Robot"
            variant="secondary"
            onClick={onOpenRobotPicker}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            }
          />
          <IconButton
            label="Open Settings"
            variant="secondary"
            onClick={onOpenSettings}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            }
          />
        </div>
      </header>

      {/* World Tabs */}
      <nav
        aria-label="World tabs"
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {WORLDS.map((w, index) => {
          const unlocked = isWorldUnlocked(w.id);
          const isSelected = w.id === selectedWorldId;

          return (
            <button
              key={w.id}
              role="tab"
              aria-selected={isSelected}
              disabled={!unlocked}
              onClick={() => setSelectedWorldId(w.id)}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-btn)',
                border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: isSelected ? 'var(--color-surface)' : 'var(--color-surface-soft)',
                color: unlocked ? 'var(--color-ink)' : 'var(--color-muted)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{unlocked ? `World ${index + 1}` : `🔒 W${index + 1}`}</span>
            </button>
          );
        })}
      </nav>

      {/* Level List / Grid */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px',
          alignContent: 'start',
          padding: '4px',
        }}
        role="region"
        aria-label="Level selection list"
      >
        {worldLevels.map((level) => {
          const unlocked = isLevelUnlocked(
            level.id,
            level.worldId,
            level.ordinal,
            progress.completedLevels,
          );
          const levelProgress = progress.levels[level.id];
          const completed = levelProgress?.completed;
          const stars = levelProgress ? totalStars(levelProgress.awards) : 0;

          return (
            <button
              key={level.id}
              className="rp-card-hover"
              disabled={!unlocked}
              onClick={() => onSelectLevel(level.id)}
              aria-label={`Level ${level.ordinal}: ${t(level.titleKey)}, ${
                !unlocked ? 'Locked' : completed ? `Completed with ${stars} stars` : 'Available to play'
              }`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 'var(--radius-panel)',
                backgroundColor: unlocked ? 'var(--color-surface)' : 'var(--color-surface-soft)',
                border: completed
                  ? '2px solid var(--color-action)'
                  : unlocked
                  ? '2px solid var(--color-primary)'
                  : '2px solid var(--color-border-subtle)',
                boxShadow: unlocked ? 'var(--shadow-sm)' : 'none',
                opacity: unlocked ? 1 : 0.6,
                cursor: unlocked ? 'pointer' : 'not-allowed',
                textAlign: 'left',
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: completed
                      ? 'var(--color-action)'
                      : unlocked
                      ? 'var(--color-primary)'
                      : 'var(--color-border)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: 'var(--text-base)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-hidden="true"
                >
                  {unlocked ? level.ordinal : '🔒'}
                </div>

                <div>
                  <h2 style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-ink)' }}>
                    {t(level.titleKey)}
                  </h2>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                    Par: {level.rating.parBlocks} blocks
                  </span>
                </div>
              </div>

              {/* Star rating display */}
              {unlocked && (
                <div style={{ display: 'flex', gap: '3px' }} aria-hidden="true">
                  {[1, 2, 3].map((starIdx) => (
                    <svg
                      key={starIdx}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={starIdx <= stars ? 'var(--color-accent)' : '#e2e8f0'}
                      stroke={starIdx <= stars ? '#d97706' : '#cbd5e1'}
                      strokeWidth="1.5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </main>
    </div>
  );
};
