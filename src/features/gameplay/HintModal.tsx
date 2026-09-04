import React, { useState } from 'react';
import { Level } from '../../core/model';
import { Dialog } from '../../ui/Dialog';
import { Button } from '../../ui/Button';
import { t } from '../../content/locales';

export interface HintModalProps {
  isOpen: boolean;
  level: Level;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({ isOpen, level, onClose }) => {
  const [currentTier, setCurrentTier] = useState<number>(1);

  const hints = level.hintKeys.map((key) => t(key));

  return (
    <Dialog
      isOpen={isOpen}
      title="Gentle Hints"
      onClose={() => {
        setCurrentTier(1);
        onClose();
      }}
      footer={
        <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
          {currentTier < hints.length ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentTier((prev) => Math.min(prev + 1, hints.length))}
            >
              Need More Help? →
            </Button>
          ) : (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
              All hints revealed!
            </span>
          )}

          <Button
            variant="action"
            size="md"
            onClick={() => {
              setCurrentTier(1);
              onClose();
            }}
          >
            Got It!
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
          Hints are here to help! Looking at hints never reduces your score or stars.
        </p>

        {hints.slice(0, currentTier).map((hintText, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              backgroundColor: index === currentTier - 1 ? 'var(--color-sky)' : 'var(--color-surface-soft)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              borderLeft: index === currentTier - 1 ? '4px solid var(--color-primary)' : '2px solid var(--color-border)',
            }}
          >
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)' }}>
              Hint Tier {index + 1} of {hints.length}
            </span>
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-ink)' }}>
              {hintText}
            </span>
          </div>
        ))}
      </div>
    </Dialog>
  );
};
