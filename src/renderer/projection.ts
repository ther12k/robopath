export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

export interface ScreenCoord {
  readonly x: number;
  readonly y: number;
}

export function toScreen(x: number, y: number): ScreenCoord {
  return {
    x: ((x - y) * TILE_WIDTH) / 2,
    y: ((y + x) * TILE_HEIGHT) / 2,
  };
}

export function calculateDepth(x: number, y: number, layerOffset = 0): number {
  return (x + y) * 100 + layerOffset;
}

export function calculateBoardBounds(
  width: number,
  height: number,
  padding = 64,
): { minX: number; maxX: number; minY: number; maxY: number; width: number; height: number } {
  const corners = [
    toScreen(0, 0),
    toScreen(width, 0),
    toScreen(0, height),
    toScreen(width, height),
  ];

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const c of corners) {
    if (c.x < minX) minX = c.x;
    if (c.x > maxX) maxX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.y > maxY) maxY = c.y;
  }

  // Account for tile thickness and sprite height
  minY -= 48;
  maxY += 64;

  return {
    minX: minX - padding,
    maxX: maxX + padding,
    minY: minY - padding,
    maxY: maxY + padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}

export interface ContentBounds {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
  readonly width: number;
  readonly height: number;
  readonly centerX: number;
  readonly centerY: number;
}

/**
 * Tight bounds of everything actually drawn for the board (tile diamonds,
 * tile slab, wall/flag/sprite headroom). Used to frame the camera so the
 * puzzle fills the viewport instead of floating far away.
 */
export function calculateContentBounds(width: number, height: number): ContentBounds {
  const corners = [
    toScreen(0, 0),
    toScreen(width, 0),
    toScreen(0, height),
    toScreen(width, height),
  ];

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const c of corners) {
    if (c.x < minX) minX = c.x;
    if (c.x > maxX) maxX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.y > maxY) maxY = c.y;
  }

  const TILE_HALF_W = TILE_WIDTH / 2; // 32
  minX -= TILE_HALF_W;
  maxX += TILE_HALF_W;
  minY -= 72; // wall/flag/robot art above the tile tops
  maxY += 34; // tile slab thickness + floating shadow

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
}
