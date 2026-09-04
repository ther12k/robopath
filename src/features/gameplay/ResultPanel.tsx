import React from 'react';
import { Level, Outcome, RunTrace } from '../../core/model';
import { totalStars } from '../../core/score';
import { Button } from '../../ui/Button';
import { RobotAvatar } from '../robots/RobotAvatar';
import { t } from '../../content/locales';

export interface ResultPanelProps {
  level: Level;
  robotId: string;
  trace: RunTrace;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onRetry: () => void;
  onBackToMap: () => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  level,
  robotId,
  trace,
  hasNextLevel,
  onNextLevel,
  onRetry,
  onBackToMap,
}) => {
  const isSuccess = trace.outcome === 'success';
  const starsEarned = totalStars(trace.awards);

  const getFailureFeedback = (outcome: Outcome, trace: RunTrace): string => {
    if (outcome === 'blocked') {
      const lastStep = trace.steps[trace.steps.length - 1];
      const reason = lastStep?.blocked?.reason;
      if (reason === 'wall') return t('outcome.blocked.wall');
      if (reason === 'closed_gate') return t('outcome.blocked.closed_gate');
      return t('outcome.blocked.void');
    }
    if (outcome === 'out_of_actions') {
      return t('outcome.out_of_actions');
    }
    return t('outcome.incomplete');
  };

  if (!isSuccess) {
    return (
      <div
        role="dialog"
        aria-label="Level attempt feedback"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(23, 50, 77, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 500,
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-panel)',
            padding: '24px',
            maxWidth: '420px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
          }}
        >
          <RobotAvatar robotId={robotId} size={72} />

          <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', color: 'var(--color-ink)' }}>
            Keep Exploring!
          </h2>

          <p style={{ margin: 0, color: 'var(--color-ink)', fontSize: 'var(--text-base)' }}>
            {getFailureFeedback(trace.outcome, trace)}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '8px' }}>
            <Button variant="action" size="lg" fullWidth onClick={onRetry}>
              Edit & Try Again
            </Button>
            <Button variant="secondary" size="md" fullWidth onClick={onBackToMap}>
              Back to Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Level success celebration"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(23, 50, 77, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 500,
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-panel)',
          padding: '24px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
        }}
      >
        <RobotAvatar robotId={robotId} size={84} />

        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: 'var(--text-2xl)', color: 'var(--color-action)' }}>
            {t('outcome.success.title')}
          </h2>
          <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>
            {t('outcome.success.message')}
          </p>
        </div>

        {/* Stars earned row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {[1, 2, 3].map((starIndex) => {
            const earned = starIndex <= starsEarned;
            return (
              <svg
                key={starIndex}
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill={earned ? 'var(--color-accent)' : '#e2e8f0'}
                stroke={earned ? '#d97706' : '#94a3b8'}
                strokeWidth="1.5"
                style={{
                  transform: earned ? 'scale(1.1)' : 'scale(0.9)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            );
          })}
        </div>

        {/* Award criteria breakdown */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
            backgroundColor: 'var(--color-surface-soft)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'left',
            fontSize: 'var(--text-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🏁 Level Complete</span>
            <span style={{ color: 'var(--color-action)', fontWeight: 700 }}>✓ Star</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⭐ Bonus Stars</span>
            <span style={{ color: trace.awards.bonus ? 'var(--color-action)' : 'var(--color-muted)', fontWeight: 700 }}>
              {trace.awards.bonus ? '✓ Star' : '–'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              🎯 Block Target (≤{level.rating.parBlocks} blocks, used {trace.usedBlocks})
            </span>
            <span style={{ color: trace.awards.efficiency ? 'var(--color-action)' : 'var(--color-muted)', fontWeight: 700 }}>
              {trace.awards.efficiency ? '✓ Star' : '–'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '8px' }}>
          {hasNextLevel && (
            <Button variant="action" size="lg" fullWidth onClick={onNextLevel}>
              Next Level →
            </Button>
          )}
          <Button variant="secondary" size="md" fullWidth onClick={onBackToMap}>
            Back to Map
          </Button>
        </div>
      </div>
    </div>
  );
};
