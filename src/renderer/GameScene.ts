import * as Phaser from 'phaser';
import { Facing, Level, State, Step } from '../core/model';
import { AnimationAck, SceneMessage } from '../bridge/messages';
import { toScreen, calculateDepth, calculateContentBounds } from './projection';
import { getRobotById } from '../features/robots/robotCatalog';

export interface GameSceneConfig {
  onAcknowledgment: (ack: AnimationAck) => void;
}

export class GameScene extends Phaser.Scene {
  private level!: Level;
  private robotId = 'pip';
  private currentState!: State;
  private currentRunId = '';
  private onAcknowledgment!: (ack: AnimationAck) => void;

  private boardContainer!: Phaser.GameObjects.Container;
  private robotContainer!: Phaser.GameObjects.Container;
  private robotBody!: Phaser.GameObjects.Image;
  private facingArrow!: Phaser.GameObjects.Triangle;
  private collectibleObjects: Map<string, Phaser.GameObjects.GameObject> = new Map();
  private gateObjects: Map<string, Phaser.GameObjects.Container> = new Map();

  constructor() {
    super({ key: 'GameScene' });
  }

  public init(data: GameSceneConfig): void {
    this.onAcknowledgment = data.onAcknowledgment;
  }

  public preload(): void {
    // Kit art (docs/ui-refresh-kit) — local, same-origin SVGs.
    const world = (name: string) => `assets/world/${name}.svg`;
    this.load.image('rp-grass', world('grass-tile'));
    this.load.image('rp-flag', world('flag'));
    this.load.image('rp-battery', world('battery'));
    this.load.image('rp-star', world('star-goal'));
    this.load.image('rp-gate-closed', world('gate-closed'));
    this.load.image('rp-gate-open', world('gate-open'));
    this.load.image('rp-switch', world('switch'));
    this.load.image('rp-rock', world('rock'));
    this.load.image('rp-tree', world('tree'));
    for (const id of ['pip', 'mochi', 'bolt', 'sprout']) {
      this.load.image(`rp-robot-${id}`, `assets/robots/${id}-front.svg`);
    }
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#78cdbd');
    this.boardContainer = this.add.container(0, 0);

    // Re-frame whenever the canvas resizes (rotation, layout, window).
    this.scale.on('resize', this.handleResize, this);
    this.events.once('shutdown', () => {
      this.scale.off('resize', this.handleResize, this);
    });

    // If level is already configured, render it
    if (this.level) {
      this.buildBoard();
    }
  }

  private handleResize(): void {
    this.centerCamera();
  }

  public handleMessage(msg: SceneMessage): void {
    switch (msg.type) {
      case 'load':
        this.level = msg.level;
        this.robotId = msg.robotId;
        this.currentState = msg.state;
        this.currentRunId = msg.runId;
        void this.currentRunId;
        if (this.boardContainer) {
          this.buildBoard();
        }
        break;

      case 'snap':
        this.currentRunId = msg.runId;
        this.currentState = msg.state;
        this.snapToState(this.currentState);
        break;

      case 'animate':
        this.animateStep(msg.runId, msg.levelRevision, msg.step, msg.durationMs);
        break;

      case 'dispose':
        this.tweens.killAll();
        break;
    }
  }

  private buildBoard(): void {
    this.boardContainer.removeAll(true);
    this.collectibleObjects.clear();
    this.gateObjects.clear();

    const { tiles, walls } = this.level.board;
    const wallSet = new Set(walls.map((w) => `${w.x},${w.y}`));

    const content = calculateContentBounds(this.level.board.width, this.level.board.height);

    // Decorative sky clouds behind the floating island
    const clouds = this.add.graphics();
    clouds.setDepth(-200);
    const drawCloud = (cx: number, cy: number, scale: number, alpha: number) => {
      clouds.fillStyle(0xffffff, alpha);
      clouds.fillEllipse(cx, cy, 96 * scale, 30 * scale);
      clouds.fillEllipse(cx - 34 * scale, cy + 4 * scale, 56 * scale, 22 * scale);
      clouds.fillEllipse(cx + 36 * scale, cy + 2 * scale, 60 * scale, 24 * scale);
    };
    drawCloud(content.minX + content.width * 0.18, content.minY + 26, 1.0, 0.75);
    drawCloud(content.maxX - content.width * 0.12, content.minY + content.height * 0.34, 0.8, 0.6);
    drawCloud(content.centerX, content.maxY + 58, 1.1, 0.55);
    this.boardContainer.add(clouds);

    // Floating-island drop shadow beneath the whole board
    const islandShadow = this.add.graphics();
    islandShadow.setDepth(-100);
    islandShadow.fillStyle(0x246fe5, 0.14);
    islandShadow.fillEllipse(
      content.centerX,
      content.maxY + 14,
      content.width * 0.8,
      content.height * 0.22 + 18,
    );
    this.boardContainer.add(islandShadow);

    // Render ground tiles (kit isometric art). The playable diamond spans
    // 104/128 of the canvas, so scale up to keep 64px tile pitch seamless.
    for (const tile of tiles) {
      const screenPos = toScreen(tile.x, tile.y);
      const isWall = wallSet.has(`${tile.x},${tile.y}`);
      const depth = calculateDepth(tile.x, tile.y, 0);

      const grass = this.add.image(screenPos.x, screenPos.y, 'rp-grass');
      grass.setOrigin(0.5, 0.375); // top-diamond center of the kit tile
      grass.setDisplaySize(79, 59);
      grass.setDepth(depth);
      this.boardContainer.add(grass);

      // Walls draw a rock decoration on the (impassable) tile
      if (isWall) {
        const rockDepth = calculateDepth(tile.x, tile.y, 30);
        const rock = this.add.image(screenPos.x, screenPos.y - 4, 'rp-rock');
        rock.setOrigin(0.5, 0.78);
        rock.setDisplaySize(52, 52);
        rock.setDepth(rockDepth);
        this.boardContainer.add(rock);
      }
    }

    // Goal flag (kit art, 96×128 → 40×53, planted on the tile)
    const goalPos = toScreen(this.level.goal.x, this.level.goal.y);
    const goalDepth = calculateDepth(this.level.goal.x, this.level.goal.y, 25);
    const flag = this.add.image(goalPos.x, goalPos.y + 6, 'rp-flag');
    flag.setOrigin(0.5, 0.88);
    flag.setDisplaySize(48, 64);
    flag.setDepth(goalDepth);
    this.boardContainer.add(flag);

    // Switch pads
    for (const sw of this.level.switches) {
      const swPos = toScreen(sw.x, sw.y);
      const swDepth = calculateDepth(sw.x, sw.y, 5);
      const pad = this.add.image(swPos.x, swPos.y, 'rp-switch');
      pad.setOrigin(0.5, 0.72);
      pad.setDisplaySize(44, 44);
      pad.setDepth(swDepth);
      this.boardContainer.add(pad);
    }

    // Gates (closed by default; swap to open art when latched)
    for (const g of this.level.gates) {
      const gPos = toScreen(g.x, g.y);
      const gDepth = calculateDepth(g.x, g.y, 20);

      const gateContainer = this.add.container(gPos.x, gPos.y);
      gateContainer.setDepth(gDepth);
      gateContainer.setData('gateId', g.id);

      const gate = this.add.image(0, 0, 'rp-gate-closed');
      gate.setOrigin(0.5, 0.82);
      gate.setDisplaySize(48, 64);
      gateContainer.add(gate);

      this.gateObjects.set(g.id, gateContainer);
      this.boardContainer.add(gateContainer);
    }

    // Collectibles (kit battery / star art)
    for (const item of this.level.collectibles) {
      const itemPos = toScreen(item.x, item.y);
      const itemDepth = calculateDepth(item.x, item.y, 15);

      const tex = item.kind === 'required' ? 'rp-battery' : 'rp-star';
      const sprite = this.add.image(itemPos.x, itemPos.y - 14, tex);
      sprite.setOrigin(0.5, 0.6);
      sprite.setDisplaySize(item.kind === 'required' ? 30 : 34, item.kind === 'required' ? 40 : 34);
      sprite.setDepth(itemDepth);

      this.collectibleObjects.set(item.id, sprite);
      this.boardContainer.add(sprite);
    }

    // Build Robot Container
    this.createRobot();

    // Position camera to center the board
    this.centerCamera();
  }

  private createRobot(): void {
    const robot = getRobotById(this.robotId);
    const startPos = toScreen(this.currentState.x, this.currentState.y);
    const startDepth = calculateDepth(this.currentState.x, this.currentState.y, 50);

    this.robotContainer = this.add.container(startPos.x, startPos.y);
    this.robotContainer.setDepth(startDepth);

    // Kit robot front art (256×256 → 60×60), includes its own contact shadow
    this.robotBody = this.add.image(0, -14, `rp-robot-${robot.id}`);
    this.robotBody.setOrigin(0.5, 0.82);
    this.robotBody.setDisplaySize(60, 60);

    // Directional foot indicator (small, subtle cue at the robot's feet)
    this.facingArrow = this.add.triangle(0, 8, 0, -9, 7, 7, -7, 7, 0x246fe5);
    this.facingArrow.setStrokeStyle(1.2, 0x17324d);
    this.facingArrow.setAlpha(0.9);
    this.updateFacingArrow(this.currentState.facing);

    this.robotContainer.add([this.facingArrow, this.robotBody]);
    this.boardContainer.add(this.robotContainer);
  }

  private updateFacingArrow(facing: Facing): void {
    // Explicit apex direction per facing — no rotation-convention ambiguity.
    switch (facing) {
      case 'N':
        this.facingArrow.setTo(0, -9, 7, 7, -7, 7);
        break;
      case 'E':
        this.facingArrow.setTo(9, 0, -7, -7, -7, 7);
        break;
      case 'S':
        this.facingArrow.setTo(0, 9, 7, -7, -7, -7);
        break;
      case 'W':
        this.facingArrow.setTo(-9, 0, 7, -7, 7, 7);
        break;
    }
  }

  private snapToState(state: State): void {
    this.currentState = state;
    const pos = toScreen(state.x, state.y);
    this.robotContainer.setPosition(pos.x, pos.y);
    this.robotContainer.setDepth(calculateDepth(state.x, state.y, 50));
    this.updateFacingArrow(state.facing);

    // Restore collectibles
    const collectedSet = new Set(state.collected);
    for (const [id, obj] of this.collectibleObjects.entries()) {
      (obj as any).setVisible(!collectedSet.has(id));
    }

    // Restore gates (open gates swap to the open art so the path stays readable)
    const openGateSet = new Set(state.openedGates);
    for (const [id, obj] of this.gateObjects.entries()) {
      const gateImage = (obj as Phaser.GameObjects.Container).list[0] as Phaser.GameObjects.Image;
      gateImage.setTexture(openGateSet.has(id) ? 'rp-gate-open' : 'rp-gate-closed');
    }
  }

  private animateStep(
    runId: string,
    levelRevision: number,
    step: Step,
    durationMs: number,
  ): void {
    const targetPos = toScreen(step.after.x, step.after.y);
    const targetDepth = calculateDepth(step.after.x, step.after.y, 50);

    // Handle turns
    if (step.before.facing !== step.after.facing) {
      this.updateFacingArrow(step.after.facing);
    }

    // Handle blocked wobble
    if (step.blocked) {
      const deltaX = (step.blocked.target.x - step.before.x) * 8;
      const deltaY = (step.blocked.target.y - step.before.y) * 4;

      this.tweens.add({
        targets: this.robotContainer,
        x: this.robotContainer.x + deltaX,
        y: this.robotContainer.y + deltaY,
        yoyo: true,
        duration: durationMs / 2,
        ease: 'Quad.easeInOut',
        onComplete: () => {
          this.onAcknowledgment({
            type: 'action_displayed',
            runId,
            levelRevision,
            actionIndex: step.actionIndex,
          });
        },
      });
      return;
    }

    // Normal movement tween
    this.tweens.add({
      targets: this.robotContainer,
      x: targetPos.x,
      y: targetPos.y,
      duration: durationMs,
      ease: 'Cubic.easeInOut',
      onUpdate: () => {
        this.robotContainer.setDepth(targetDepth);
      },
      onComplete: () => {
        this.currentState = step.after;

        // Process step events (pickups / gates)
        for (const ev of step.events) {
          if (ev.kind === 'collect') {
            const itemObj = this.collectibleObjects.get(ev.id);
            if (itemObj) {
              this.tweens.add({
                targets: itemObj,
                alpha: 0,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 180,
                onComplete: () => (itemObj as any).setVisible(false),
              });
            }
          } else if (ev.kind === 'open_gate') {
            const gateObj = this.gateObjects.get(ev.id);
            if (gateObj) {
              const gateImage = (gateObj as Phaser.GameObjects.Container)
                .list[0] as Phaser.GameObjects.Image;
              this.tweens.add({
                targets: gateObj,
                alpha: 0.25,
                duration: 200,
                onComplete: () => {
                  gateImage.setTexture('rp-gate-open');
                  (gateObj as Phaser.GameObjects.Container).setAlpha(1);
                },
              });
            }
          }
        }

        this.onAcknowledgment({
          type: 'action_displayed',
          runId,
          levelRevision,
          actionIndex: step.actionIndex,
        });
      },
    });
  }

  public centerCamera(): void {
    if (!this.level || !this.cameras?.main) return;
    const camera = this.cameras.main;
    const content = calculateContentBounds(this.level.board.width, this.level.board.height);

    // Fit the puzzle content into the canvas with a small breathing margin,
    // so even a tiny 3-tile board fills the viewport instead of floating far away.
    const margin = 24;
    const availW = Math.max(camera.width - margin * 2, 60);
    const availH = Math.max(camera.height - margin * 2, 60);
    const zoom = Math.min(availW / content.width, availH / content.height);

    camera.setZoom(Phaser.Math.Clamp(zoom, 0.5, 3));
    camera.centerOn(content.centerX, content.centerY);
  }
}
