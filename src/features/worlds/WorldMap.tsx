import React, { useState } from 'react';
import { getLevelsForWorld } from '../../content/levels';
import { Level } from '../../core/model';
import { PlayerProgress, isLevelUnlocked } from '../../core/progression';
import { totalStars } from '../../core/score';
import { RobotAvatar } from '../robots/RobotAvatar';
import { IconButton } from '../../ui/IconButton';
import { KitImage } from '../../ui/KitImage';
import { t } from '../../content/locales';

export interface WorldMapProps {
  progress: PlayerProgress;
  onSelectLevel: (levelId: string) => void;
  onOpenRobotPicker: () => void;
  onOpenSettings: () => void;
}

export const WORLDS = [
  { id: 'w1', title: 'Sunny Meadow', color: '#207a46' },
  { id: 'w2', title: 'Pebble Workshop', color: '#246fe5' },
  { id: 'w3', title: 'Crystal Grove', color: '#7056c8' },
  { id: 'w4', title: 'Sky Isles', color: '#f5bd35' },
];

/** Winding waypoints (percent coords) the level nodes sit along. */
const PATH: ReadonlyArray<{ x: number; y: number }> = [
  { x: 16, y: 84 }, { x: 38, y: 72 }, { x: 22, y: 56 }, { x: 46, y: 46 },
  { x: 68, y: 54 }, { x: 78, y: 36 }, { x: 58, y: 26 }, { x: 34, y: 18 },
  { x: 52, y: 10 }, { x: 76, y: 12 }, { x: 88, y: 24 }, { x: 70, y: 70 },
  { x: 30, y: 34 }, { x: 86, y: 48 }, { x: 48, y: 60 },
];

const WorldMap: React.FC<WorldMapProps> = ({
  progress,
  onSelectLevel,
  onOpenRobotPicker,
  onOpenSettings,
}) => {
  const [selectedWorldId, setSelectedWorldId] = useState<string>('w1');
  const [listView, setListView] = useState<boolean>(false);
  const currentWorld = WORLDS.find((w) => w.id === selectedWorldId) ?? WORLDS[0];
  const worldLevels = getLevelsForWorld(selectedWorldId);
  const totalWorldCompleted = progress.completedLevels.filter((id) =>
    id.startsWith(`${selectedWorldId}-`),
  ).length;

  const isWorldUnlocked = (wid: string): boolean => {
    if (wid === 'w1') return true;
    const prev = WORLDS[WORLDS.findIndex((w) => w.id === wid) - 1];
    return progress.completedLevels.filter((id) => id.startsWith(`${prev.id}-`)).length >= 10;
  };

  const nodeState = (level: Level): 'completed' | 'available' | 'locked' => {
    if (progress.levels[level.id]?.completed) return 'completed';
    return isLevelUnlocked(level.id, level.worldId, level.ordinal, progress.completedLevels)
      ? 'available'
      : 'locked';
  };

  return (
    <div
      className="rp-sky-gradient"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        maxWidth: '760px',
        margin: '0 auto',
        padding: '12px 16px calc(12px + var(--sab))',
        boxSizing: 'border-box',
        gap: '10px',
      }}
    >
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onOpenRobotPicker}
            aria-label="Change selected robot"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', borderRadius: '50%' }}
          >
            <RobotAvatar robotId={progress.selectedRobotId} size={48} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 'var(--text-xl)', color: 'var(--color-ink)' }}>
              {currentWorld.title}
            </h1>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', fontWeight: 600 }}>
              {totalWorldCompleted} / {worldLevels.length} completed
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <IconButton
            label={listView ? 'Show map view' : 'Show list view'}
            variant="secondary"
            onClick={() => setListView((v) => !v)}
            icon={
              listView ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M5 15c2-2 4-2 7-1s5 0 7-2M5 10c2-1.6 4-1.6 7-.6" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <circle cx="4" cy="6" r="1" fill="currentColor" />
                  <circle cx="4" cy="12" r="1" fill="currentColor" />
                  <circle cx="4" cy="18" r="1" fill="currentColor" />
                </svg>
              )
            }
          />
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

      {/* World tabs */}
      <nav aria-label="Worlds" style={{ display: 'flex', gap: '8px' }}>
        {WORLDS.map((w, i) => {
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
                padding: '9px 10px',
                borderRadius: 'var(--radius-btn)',
                border: isSelected ? `2px solid ${w.color}` : '1px solid var(--color-border)',
                backgroundColor: isSelected ? 'var(--color-surface)' : 'var(--color-surface-soft)',
                color: unlocked ? 'var(--color-ink)' : 'var(--color-muted)',
                fontWeight: 700,
                fontSize: 'var(--text-xs)',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {unlocked ? w.title : `🔒 W${i + 1}`}
            </button>
          );
        })}
      </nav>

      {listView ? (
        <main
          role="region"
          aria-label={`${currentWorld.title} level list`}
          style={{ flex: 1, overflowY: 'auto', display: 'grid', gap: '10px', alignContent: 'start' }}
        >
          {worldLevels.map((level) => {
            const state = nodeState(level);
            const stars = progress.levels[level.id]
              ? totalStars(progress.levels[level.id].awards)
              : 0;
            return (
              <button
                key={level.id}
                className="rp-card-hover"
                disabled={state === 'locked'}
                onClick={() => onSelectLevel(level.id)}
                aria-label={`Level ${level.ordinal}: ${t(level.titleKey)}, ${
                  state === 'locked' ? 'locked' : state === 'completed' ? `completed with ${stars} of 3 stars` : 'available'
                }`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-tile)',
                  backgroundColor: 'var(--color-surface)',
                  border:
                    state === 'completed'
                      ? '2px solid var(--color-action)'
                      : state === 'available'
                      ? '2px solid var(--color-primary)'
                      : '2px solid var(--color-border-subtle)',
                  opacity: state === 'locked' ? 0.6 : 1,
                  cursor: state === 'locked' ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      color: '#fff',
                      background:
                        state === 'completed'
                          ? 'var(--color-action)'
                          : state === 'available'
                          ? 'var(--color-primary)'
                          : 'var(--color-border)',
                    }}
                  >
                    {state === 'locked' ? '🔒' : level.ordinal}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--color-ink)' }}>
                    {t(level.titleKey)}
                  </span>
                </div>
                {state !== 'locked' && (
                  <span aria-hidden="true" style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3].map((s) => (
                      <KitImage
                        key={s}
                        src="icons/star.svg"
                        alt=""
                        size={16}
                        style={s <= stars ? undefined : { opacity: 0.25 }}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </main>
      ) : (
        <main
          role="region"
          aria-label={`${currentWorld.title} journey map`}
          style={{
            flex: 1,
            position: 'relative',
            borderRadius: 'var(--radius-panel)',
            border: '2px solid rgba(255,255,255,0.9)',
            boxShadow: '0 10px 24px rgba(23,50,77,0.10)',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          {/* Sky backdrop */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, #bfe6fb 0%, #d9f2c8 62%, #9be267 100%)',
            }}
          />
          {/* Rolling hills */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(52% 42% at 18% 96%, #7cc44e 60%, transparent 61%), radial-gradient(60% 48% at 78% 100%, #8ace58 60%, transparent 61%)',
            }}
          />
          {/* Winding path connecting the nodes */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            <polyline
              points={PATH.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#fdf7e3"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 3"
              opacity="0.9"
            />
          </svg>
          <div className="rp-cloud" style={{ width: 110, height: 32, top: '8%', left: '6%' }} aria-hidden="true" />
          <div className="rp-cloud" style={{ width: 80, height: 24, top: '16%', right: '10%', opacity: 0.8 }} aria-hidden="true" />

          {/* Level nodes along the path */}
          {worldLevels.map((level, idx) => {
            const state = nodeState(level);
            const stars = progress.levels[level.id]
              ? totalStars(progress.levels[level.id].awards)
              : 0;
            const p = PATH[idx % PATH.length];
            return (
              <button
                key={level.id}
                onClick={() => state !== 'locked' && onSelectLevel(level.id)}
                disabled={state === 'locked'}
                aria-label={`Level ${level.ordinal}: ${t(level.titleKey)}, ${
                  state === 'locked' ? 'locked' : state === 'completed' ? `completed with ${stars} of 3 stars` : 'available'
                }. Use the list view button for a linear list.`}
                style={{
                  position: 'absolute',
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  border:
                    state === 'completed'
                      ? '3px solid var(--color-action)'
                      : state === 'available'
                      ? '3px solid var(--color-primary)'
                      : '3px solid #b9c9d8',
                  background:
                    state === 'completed'
                      ? 'var(--color-action)'
                      : state === 'available'
                      ? 'var(--color-surface)'
                      : '#e2eaf1',
                  color:
                    state === 'completed'
                      ? '#fff'
                      : state === 'available'
                      ? 'var(--color-ink)'
                      : '#8ba0b3',
                  fontWeight: 800,
                  fontSize: 'var(--text-lg)',
                  cursor: state === 'locked' ? 'not-allowed' : 'pointer',
                  boxShadow:
                    state === 'available'
                      ? '0 0 0 4px rgba(36, 111, 229, 0.18)'
                      : '0 4px 10px rgba(23,50,77,0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                {state === 'locked'
                  ? '🔒'
                  : state === 'completed'
                  ? <KitImage src="icons/star.svg" alt="" size={20} />
                  : level.ordinal}
                {state === 'completed' && (
                  <span aria-hidden="true" style={{ fontSize: '9px', fontWeight: 800 }}>{stars}/3</span>
                )}
              </button>
            );
          })}
        </main>
      )}
    </div>
  );
};

export { WorldMap };
