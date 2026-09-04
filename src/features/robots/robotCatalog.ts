export interface RobotDefinition {
  readonly id: string;
  readonly name: string;
  readonly starter: boolean;
  readonly cosmeticOnly: boolean;
  readonly assetSet: string;
  readonly description: string;
  readonly primaryColor: string;
  readonly accentColor: string;
  readonly faceColor: string;
  readonly antennaType: 'ball' | 'ears' | 'bolt' | 'leaf';
}

export const ROBOTS: readonly RobotDefinition[] = [
  {
    id: 'pip',
    name: 'Pip',
    starter: true,
    cosmeticOnly: true,
    assetSet: 'pip-placeholder-v1',
    description: 'A curious explorer robot with a white shell and blue antenna.',
    primaryColor: '#ffffff',
    accentColor: '#246fe5',
    faceColor: '#38bdf8',
    antennaType: 'ball',
  },
  {
    id: 'mochi',
    name: 'Mochi',
    starter: true,
    cosmeticOnly: true,
    assetSet: 'mochi-placeholder-v1',
    description: 'A cheerful rounded bot with soft pink panels and warm screen.',
    primaryColor: '#fce7f3',
    accentColor: '#ec4899',
    faceColor: '#fde047',
    antennaType: 'ears',
  },
  {
    id: 'bolt',
    name: 'Bolt',
    starter: true,
    cosmeticOnly: true,
    assetSet: 'bolt-placeholder-v1',
    description: 'A sturdy utility bot built with bright yellow panels.',
    primaryColor: '#fef08a',
    accentColor: '#eab308',
    faceColor: '#60a5fa',
    antennaType: 'bolt',
  },
  {
    id: 'sprout',
    name: 'Sprout',
    starter: true,
    cosmeticOnly: true,
    assetSet: 'sprout-placeholder-v1',
    description: 'A friendly garden bot with clean white casing and leaf accent.',
    primaryColor: '#ecfccb',
    accentColor: '#84cc16',
    faceColor: '#86efac',
    antennaType: 'leaf',
  },
];

export function getRobotById(id: string): RobotDefinition {
  const found = ROBOTS.find((r) => r.id === id);
  return found || ROBOTS[0];
}
