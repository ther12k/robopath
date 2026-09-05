import React from 'react';
import { ROBOTS, RobotDefinition } from './robotCatalog';
import { Button } from '../../ui/Button';
import { KitImage, ROBOT_FRONT, ROBOT_AVATAR } from '../../ui/KitImage';

export interface RobotPickerProps {
  selectedRobotId: string;
  onSelectRobot: (robotId: string) => void;
  onConfirm: () => void;
  /** Label reflects where confirmation navigates (audit RPUX-006). */
  confirmLabel?: string;
}

export const RobotPicker: React.FC<RobotPickerProps> = ({
  selectedRobotId,
  onSelectRobot,
  onConfirm,
  confirmLabel = "Let's Go! →",
}) => {
  const selected = ROBOTS.find((r) => r.id === selectedRobotId) ?? ROBOTS[0];

  return (
    <div
      className="rp-sky-gradient"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px 20px calc(20px + var(--sab))',
        maxWidth: '560px',
        margin: '0 auto',
        minHeight: '100dvh',
        boxSizing: 'border-box',
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 'var(--text-2xl)',
          color: 'var(--color-ink)',
          textAlign: 'center',
        }}
      >
        Choose Your Robot
      </h1>

      {/* Hero stage: the selected character is the star of this screen. */}
      <div
        className="rp-picker-stage"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '20px 24px 24px',
        }}
      >
        <div className="rp-hero-blob" style={{ display: 'flex' }}>
          <KitImage
            src={ROBOT_FRONT[selected.id] ?? ROBOT_FRONT.pip}
            alt={`${selected.name} robot`}
            size={190}
          />
        </div>
        <h2 style={{ margin: 0, fontSize: 'var(--text-2xl)', color: 'var(--color-ink)' }}>
          {selected.name}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--text-sm)',
            color: 'var(--color-muted)',
            textAlign: 'center',
            maxWidth: '320px',
          }}
        >
          {selected.description}
        </p>
      </div>

      {/* Portrait options — radiogroup semantics preserved. */}
      <div
        role="radiogroup"
        aria-label="Choose your robot"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
        }}
      >
        {ROBOTS.map((robot: RobotDefinition) => {
          const isSelected = robot.id === selectedRobotId;
          return (
            <button
              key={robot.id}
              className="rp-picker-option"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectRobot(robot.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 6px',
                cursor: 'pointer',
              }}
            >
              <KitImage
                src={ROBOT_AVATAR[robot.id] ?? ROBOT_AVATAR.pip}
                alt=""
                size={56}
              />
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                }}
              >
                {robot.name}
              </span>
              {isSelected && (
                <span
                  aria-hidden="true"
                  style={{
                    color: 'var(--color-action)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 800,
                  }}
                >
                  ✓ picked
                </span>
              )}
            </button>
          );
        })}
      </div>

      <Button
        variant="action"
        size="lg"
        fullWidth
        className="rp-press"
        onClick={onConfirm}
      >
        {confirmLabel}
      </Button>

      <p
        style={{
          margin: 0,
          fontSize: 'var(--text-xs)',
          color: 'var(--color-muted)',
          textAlign: 'center',
        }}
      >
        All robots move exactly the same — pick whoever feels like yours.
      </p>
    </div>
  );
};
