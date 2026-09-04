import React, { useState } from 'react';
import { PlayerProgress } from '../../core/progression';
import { StorageAdapter } from '../../storage/storageAdapter';
import { Dialog } from '../../ui/Dialog';
import { Button } from '../../ui/Button';

export interface SettingsModalProps {
  isOpen: boolean;
  progress: PlayerProgress;
  storage: StorageAdapter;
  onUpdateProgress: (progress: PlayerProgress) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  progress,
  storage,
  onUpdateProgress,
  onClose,
}) => {
  const [showEraseConfirm, setShowEraseConfirm] = useState(false);

  const toggleSound = () => {
    const updated: PlayerProgress = {
      ...progress,
      settings: {
        ...progress.settings,
        soundEnabled: !progress.settings.soundEnabled,
      },
    };
    onUpdateProgress(updated);
    storage.saveProgress(updated).catch(console.error);
  };

  const toggleReducedMotion = () => {
    const updated: PlayerProgress = {
      ...progress,
      settings: {
        ...progress.settings,
        reducedMotion: !progress.settings.reducedMotion,
      },
    };
    onUpdateProgress(updated);
    storage.saveProgress(updated).catch(console.error);
  };

  const handleEraseAll = async () => {
    await storage.clearAll();
    window.location.reload();
  };

  return (
    <Dialog isOpen={isOpen} title="Settings & Grown-Up Area" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Audio & Motion Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '8px 0',
            }}
          >
            <span style={{ fontWeight: 600 }}>Sound Effects</span>
            <input
              type="checkbox"
              checked={progress.settings.soundEnabled}
              onChange={toggleSound}
              style={{ width: '24px', height: '24px', accentColor: 'var(--color-primary)' }}
            />
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '8px 0',
            }}
          >
            <span style={{ fontWeight: 600 }}>Reduced Motion</span>
            <input
              type="checkbox"
              checked={progress.settings.reducedMotion}
              onChange={toggleReducedMotion}
              style={{ width: '24px', height: '24px', accentColor: 'var(--color-primary)' }}
            />
          </label>
        </div>

        {/* Data & Privacy Notice */}
        <div
          style={{
            backgroundColor: 'var(--color-sky)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--color-primary)',
            fontSize: 'var(--text-sm)',
            lineHeight: 1.5,
          }}
        >
          <h3 style={{ margin: '0 0 6px 0', fontSize: 'var(--text-sm)', color: 'var(--color-ink)' }}>
            🔒 Privacy & Storage Notice
          </h3>
          <p style={{ margin: 0, color: 'var(--color-muted)' }}>
            All puzzle progress, robot choice, and settings are saved locally on this device. No personal data, tracking cookies, or external accounts are used.
          </p>
          {storage.isFallback() && (
            <p style={{ margin: '8px 0 0 0', color: 'var(--color-coral)', fontWeight: 600 }}>
              Notice: Storage is running in temporary in-memory mode. Progress may not persist across browser restarts.
            </p>
          )}
        </div>

        {/* Destructive Erase Action */}
        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '16px' }}>
          {!showEraseConfirm ? (
            <Button
              variant="secondary"
              size="md"
              fullWidth
              style={{ color: 'var(--color-coral)', borderColor: 'var(--color-coral)' }}
              onClick={() => setShowEraseConfirm(true)}
            >
              Reset All Progress
            </Button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-coral)', fontWeight: 600 }}>
                Are you sure? This will delete all completed stars, levels, and saved drafts.
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="coral" size="md" style={{ flex: 1 }} onClick={handleEraseAll}>
                  Yes, Erase Everything
                </Button>
                <Button variant="secondary" size="md" style={{ flex: 1 }} onClick={() => setShowEraseConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
