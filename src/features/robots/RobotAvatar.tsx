import React from 'react';
import { getRobotById } from './robotCatalog';

export interface RobotAvatarProps {
  robotId: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const RobotAvatar: React.FC<RobotAvatarProps> = ({
  robotId,
  size = 64,
  className = '',
  style,
}) => {
  const robot = getRobotById(robotId);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`rp-robot-avatar ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      role="img"
      aria-label={`${robot.name} robot avatar`}
    >
      {/* Background soft circle */}
      <circle cx="32" cy="32" r="30" fill="var(--color-sky)" stroke="var(--color-border)" strokeWidth="2" />

      {/* Robot Head */}
      <rect
        x="16"
        y="18"
        width="32"
        height="28"
        rx="8"
        fill={robot.primaryColor}
        stroke="var(--color-ink)"
        strokeWidth="2.5"
      />

      {/* Robot Antenna */}
      {robot.antennaType === 'ball' && (
        <>
          <line x1="32" y1="18" x2="32" y2="10" stroke="var(--color-ink)" strokeWidth="2.5" />
          <circle cx="32" cy="8" r="4" fill={robot.accentColor} stroke="var(--color-ink)" strokeWidth="2" />
        </>
      )}
      {robot.antennaType === 'ears' && (
        <>
          <circle cx="14" cy="28" r="5" fill={robot.accentColor} stroke="var(--color-ink)" strokeWidth="2" />
          <circle cx="50" cy="28" r="5" fill={robot.accentColor} stroke="var(--color-ink)" strokeWidth="2" />
        </>
      )}
      {robot.antennaType === 'bolt' && (
        <>
          <path d="M30 18 L34 10 L30 10 L33 6" stroke={robot.accentColor} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {robot.antennaType === 'leaf' && (
        <>
          <path d="M32 18 Q36 10 40 10 Q36 14 32 18" fill={robot.accentColor} stroke="var(--color-ink)" strokeWidth="1.5" />
        </>
      )}

      {/* Screen Face */}
      <rect
        x="20"
        y="24"
        width="24"
        height="16"
        rx="4"
        fill="var(--color-ink)"
      />

      {/* Eyes */}
      <circle cx="26" cy="31" r="3" fill={robot.faceColor} />
      <circle cx="38" cy="31" r="3" fill={robot.faceColor} />

      {/* Eye highlights */}
      <circle cx="27" cy="30" r="1" fill="#ffffff" />
      <circle cx="39" cy="30" r="1" fill="#ffffff" />

      {/* Cheerful Mouth */}
      <path d="M30 36 Q32 38 34 36" stroke={robot.faceColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Chest Accent */}
      <circle cx="32" cy="52" r="3" fill={robot.accentColor} />
    </svg>
  );
};
