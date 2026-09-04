import React from 'react';
import { ROBOTS, RobotDefinition } from './robotCatalog';
import { RobotAvatar } from './RobotAvatar';
import { Button } from '../../ui/Button';

export interface RobotPickerProps {
  selectedRobotId: string;
  onSelectRobot: (robotId: string) => void;
  onConfirm: () => void;
}

export const RobotPicker: React.FC<RobotPickerProps> = ({
  selectedRobotId,
  onSelectRobot,
  onConfirm,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '24px',
        maxWidth: '540px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-ink)', margin: '0 0 8px 0' }}>
          Choose Your Robot
        </h1>
        <p style={{ color: 'var(--color-muted)', margin: 0, fontSize: 'var(--text-base)' }}>
          Pick your favorite robot companion! All robots have identical speed and capabilities.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Choose your robot"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}
      >
        {ROBOTS.map((robot: RobotDefinition) => {
          const isSelected = robot.id === selectedRobotId;

          return (
            <button
              key={robot.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectRobot(robot.id)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px',
                borderRadius: 'var(--radius-panel)',
                backgroundColor: isSelected ? 'var(--color-surface)' : 'var(--color-surface-soft)',
                border: isSelected ? '3px solid var(--color-action)' : '2px solid var(--color-border-subtle)',
                boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none',
                textAlign: 'center',
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-action)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                  aria-hidden="true"
                >
                  ✓
                </div>
              )}

              <RobotAvatar robotId={robot.id} size={80} />

              <h2
                style={{
                  margin: '12px 0 4px 0',
                  fontSize: 'var(--text-lg)',
                  color: 'var(--color-ink)',
                }}
              >
                {robot.name}
              </h2>

              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-muted)',
                  lineHeight: 1.4,
                }}
              >
                {robot.description}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        variant="action"
        size="lg"
        fullWidth
        onClick={onConfirm}
        style={{ marginTop: '8px' }}
      >
        Let&apos;s Go! →
      </Button>
    </div>
  );
};
