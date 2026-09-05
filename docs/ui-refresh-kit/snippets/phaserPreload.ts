export function preloadStarterArt(scene: Phaser.Scene) {
  scene.load.svg('tile-grass', '/assets/world/grass-tile.svg');
  scene.load.svg('tile-water', '/assets/world/water-tile.svg');
  scene.load.svg('goal-flag', '/assets/world/flag.svg');
  scene.load.svg('goal-star', '/assets/world/star-goal.svg');
  scene.load.svg('pickup-battery', '/assets/world/battery.svg');
  scene.load.svg('robot-pip', '/assets/robots/pip-front.svg');
  scene.load.svg('robot-mochi', '/assets/robots/mochi-front.svg');
  scene.load.svg('robot-bolt', '/assets/robots/bolt-front.svg');
  scene.load.svg('robot-sprout', '/assets/robots/sprout-front.svg');
}
