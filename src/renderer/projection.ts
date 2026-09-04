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
