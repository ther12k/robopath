import React from 'react';

export interface KitImageProps {
  src: string;
  alt: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  draggable?: boolean;
}

/** Renders one of the bundled SVG assets from /public/assets. */
export const KitImage: React.FC<KitImageProps> = ({
  src,
  alt,
  size,
  width,
  height,
  className,
  style,
  draggable = false,
}) => (
  <img
    src={`/assets/${src}`}
    alt={alt}
    draggable={draggable}
    className={className}
    style={{
      width: width ?? size,
      height: height ?? size,
      display: 'inline-block',
      verticalAlign: 'middle',
      pointerEvents: 'none',
      userSelect: 'none',
      ...style,
    }}
  />
);

export const ROBOT_FRONT: Record<string, string> = {
  pip: 'robots/pip-front.svg',
  mochi: 'robots/mochi-front.svg',
  bolt: 'robots/bolt-front.svg',
  sprout: 'robots/sprout-front.svg',
};

export const ROBOT_AVATAR: Record<string, string> = {
  pip: 'robots/avatars/pip-avatar.svg',
  mochi: 'robots/avatars/mochi-avatar.svg',
  bolt: 'robots/avatars/bolt-avatar.svg',
  sprout: 'robots/avatars/sprout-avatar.svg',
};

export const BLOCK_ICON: Record<string, string> = {
  forward: 'command-blocks/move.svg',
  left: 'command-blocks/turn-left.svg',
  right: 'command-blocks/turn-right.svg',
  repeat: 'command-blocks/repeat.svg',
};

export const UI_ICON: Record<string, string> = {
  run: 'icons/run.svg',
  stop: 'icons/stop.svg',
  undo: 'icons/undo.svg',
  hint: 'icons/hint.svg',
  home: 'icons/home.svg',
  next: 'icons/next.svg',
  map: 'icons/map.svg',
  star: 'icons/star.svg',
  badge: 'icons/badge.svg',
  locked: 'icons/locked.svg',
  settings: 'icons/settings.svg',
  repeat: 'icons/repeat.svg',
};
