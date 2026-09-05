import React from 'react';
import { getRobotById } from './robotCatalog';
import { KitImage, ROBOT_AVATAR } from '../../ui/KitImage';

export interface RobotAvatarProps {
  robotId: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** Renders the selected robot's portrait using the bundled kit art. */
export const RobotAvatar: React.FC<RobotAvatarProps> = ({
  robotId,
  size = 64,
  className = '',
  style,
}) => {
  const robot = getRobotById(robotId);
  return (
    <KitImage
      src={ROBOT_AVATAR[robot.id] ?? ROBOT_AVATAR.pip}
      alt={`${robot.name} robot portrait`}
      size={size}
      className={`rp-robot-avatar ${className}`}
      style={style}
    />
  );
};
