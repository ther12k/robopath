import * as Phaser from 'phaser';
import { Facing, Level, State, Step } from '../core/model';
import { AnimationAck, SceneMessage } from '../bridge/messages';
import { toScreen, calculateDepth, calculateContentBounds } from './projection';
import { getRobotById } from '../features/robots/robotCatalog';

export interface GameSceneConfig {
  onAcknowledgment: (ack: AnimationAck) => void;
}

/** Logical facing → directional pose texture suffix (RPUX-002). */
const FACING_VIEW: Record<Facing, 'n' | 'e' | 's' | 'w'> = {
  N: 'n',
  E: 'e',
  S: 's',
  W: 'w',
};

/**
 * Isometric board scene.
 *
 * Render order: world objects are added to the SCENE display list (not a
 * container) because Phaser containers render children in insertion order
 * and ignore child depth (UI/UX audit RPUX-005). Scene-level `setDepth`
 * with the deterministic (x + y) * 100 + layer tie-break gives correct
 * foreground/background sorting, including the robot passing behind and in
 * front of tall scenery.
 */
export class GameScene extends Phaser.Scene {
  private level!: Level;
  private robotId = 'pip';
  private currentState!: State;
  private onAcknowledgment!: (ack: AnimationAck) => void;

  private worldObjects: Phaser.GameObjects.GameObject[] = [];
  private boardReady = false;
  private robotContainer!: Phaser.GameObjects.Container;
  private robotBody!: Phaser.GameObjects.Image;
  private facingArrow!: Phaser.GameObjects.Triangle;
  private collectibleObjects: Map<string, Phaser.GameObjects.Image> = new Map();
  private gateObjects: Map<string, Phaser.GameObjects.Image> = new Map();

  constructor() {
    super({ key: 'GameScene' });
  }

  public init(data: GameSceneConfig): void {
    this.onAcknowledgment = data.onAcknowledgment;
  }

  public preload(): void {
    const world = (name: string) => `assets/world/${name}.svg`;
    this.load.image('rp-grass', world('grass-tile'));
    this.load.image('rp-flag', world('flag'));
    this.load.image('rp-battery', world('battery'));
    this.load.image('rp-star', world('star-goal'));
    this.load.image('rp-gate-closed', world('gate-closed'));
    this.load.image('rp-gate-open', world('gate-open'));
    this.load.image('rp-switch', world('switch'));
    this.load.image('rp-rock', world('rock'));
    for (const id of ['pip', 'mochi', 'bolt', 'sprout']) {
      for (const view of ['n', 'e', 's', 'w'] as const) {
        this.load.image(`rp-robot-${id}-${view}`, `assets/robots/${id}-${view}.svg`);
      }
    }
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#ddf1fc');

    // Re-frame whenever the canvas resizes (rotation, layout, window).
    this.scale.on('resize', this.handleResize, this);
    this.events.once('shutdown', () => {
      this.scale.off('resize', this.handleResize, this);
    });

    this.boardReady = true;
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
        if (this.boardReady) {
          this.buildBoard();
        }
        break;

      case 'snap':
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

  /** Destroys everything from a previous board build. */
  private clearWorld(): void {
    this.tweens.killTweensOf(this.worldObjects);
    this.tweens.killTweensOf(this.robotContainer);
    for (const obj of this.worldObjects) obj.destroy();
    this.robotContainer?.destroy();
    this.worldObjects = [];
    this.collectibleObjects.clear();
    this.gateObjects.clear();
  }

  /** Adds a world object to the scene (depth-honored) and tracks it. */
  private track<T extends Phaser.GameObjects.GameObject>(obj: T): T {
    this.worldObjects.push(obj);
    return obj;
  }

  private buildBoard(): void {
    this.clearWorld();

    const { tiles, walls } = this.level.board;
    const wallSet = new Set(walls.map((w) => `${w.x},${w.y}`));
    const content = calculateContentBounds(this.level.board.width, this.level.board.height);

    // Decorative sky clouds behind the floating island (scene-level, depth < 0)
    const clouds = this.add.graphics().setDepth(-200);
    const drawCloud = (cx: number, cy: number, scale: number, alpha: number) => {
      clouds.fillStyle(0xffffff, alpha);
      clouds.fillEllipse(cx, cy, 96 * scale, 30 * scale);
      clouds.fillEllipse(cx - 34 * scale, cy + 4 * scale, 56 * scale, 22 * scale);
      clouds.fillEllipse(cx + 36 * scale, cy + 2 * scale, 60 * scale, 24 * scale);
    };
    drawCloud(content.minX + content.width * 0.18, content.minY + 26, 1.0, 0.75);
    drawCloud(content.maxX - content.width * 0.12, content.minY + content.height * 0.34, 0.8, 0.6);
    drawCloud(content.centerX, content.maxY + 58, 1.1, 0.55);
    this.track(clouds);

    // Floating-island drop shadow beneath the whole board
    const islandShadow = this.add.graphics().setDepth(-100);
    islandShadow.fillStyle(0x246fe5, 0.14);
    islandShadow.fillEllipse(
      content.centerX,
      content.maxY + 14,
      content.width * 0.8,
      content.height * 0.22 + 18,
    );
    this.track(islandShadow);

    // Ground tiles (kit isometric art; diamond spans 104/128 of canvas)
    for (const tile of tiles) {
      const screenPos = toScreen(tile.x, tile.y);
      const isWall = wallSet.has(`${tile.x},${tile.y}`);

      const grass = this.track(
        this.add.image(screenPos.x, screenPos.y, 'rp-grass').setDepth(
          calculateDepth(tile.x, tile.y, 0),
        ),
      );
      grass.setOrigin(0.5, 0.375);
      grass.setDisplaySize(79, 59);

      if (isWall) {
        const rock = this.track(
          this.add.image(screenPos.x, screenPos.y - 4, 'rp-rock').setDepth(
            calculateDepth(tile.x, tile.y, 30),
          ),
        );
        rock.setOrigin(0.5, 0.78);
        rock.setDisplaySize(52, 52);
      }
    }

    // Goal flag
    const goalPos = toScreen(this.level.goal.x, this.level.goal.y);
    const flag = this.track(
      this.add.image(goalPos.x, goalPos.y + 6, 'rp-flag').setDepth(
        calculateDepth(this.level.goal.x, this.level.goal.y, 25),
      ),
    );
    flag.setOrigin(0.5, 0.88);
    flag.setDisplaySize(48, 64);

    // Switch pads
    for (const sw of this.level.switches) {
      const swPos = toScreen(sw.x, sw.y);
      const pad = this.track(
        this.add.image(swPos.x, swPos.y, 'rp-switch').setDepth(
          calculateDepth(sw.x, sw.y, 5),
        ),
      );
      pad.setOrigin(0.5, 0.72);
      pad.setDisplaySize(44, 44);
    }

    // Gates (texture swaps between closed/open art)
    for (const g of this.level.gates) {
      const gPos = toScreen(g.x, g.y);
      const gate = this.track(
        this.add.image(gPos.x, gPos.y, 'rp-gate-closed').setDepth(
          calculateDepth(g.x, g.y, 20),
        ),
      );
      gate.setOrigin(0.5, 0.82);
      gate.setDisplaySize(48, 64);
      this.gateObjects.set(g.id, gate);
    }

    // Collectibles (kit battery / star art)
    for (const item of this.level.collectibles) {
      const itemPos = toScreen(item.x, item.y);
      const sprite = this.track(
        this.add
          .image(itemPos.x, itemPos.y - 14, item.kind === 'required' ? 'rp-battery' : 'rp-star')
          .setDepth(calculateDepth(item.x, item.y, 15)),
      );
      sprite.setOrigin(0.5, 0.6);
      sprite.setDisplaySize(
        item.kind === 'required' ? 30 : 34,
        item.kind === 'required' ? 40 : 34,
      );
      this.collectibleObjects.set(item.id, sprite);
    }

    this.createRobot();
    this.centerCamera();
  }

  private robotTextureKey(): string {
    return `rp-robot-${this.robotId}-${FACING_VIEW[this.currentState.facing]}`;
  }

  private createRobot(): void {
    const robot = getRobotById(this.robotId);
    const startPos = toScreen(this.currentState.x, this.currentState.y);

    // Scene-level container: its own depth participates in display sorting.
    this.robotContainer = this.add.container(startPos.x, startPos.y);
    this.robotContainer.setDepth(calculateDepth(this.currentState.x, this.currentState.y, 50));
    this.track(this.robotContainer);

    // Directional pose art — facing is conveyed by the character itself.
    this.robotBody = this.add.image(0, -14, this.robotTextureKey());
    this.robotBody.setOrigin(0.5, 0.82);
    this.robotBody.setDisplaySize(60, 60);
    void robot;

    // Supplementary facing cue (accessibility aid, not the only signal)
    this.facingArrow = this.add.triangle(0, 8, 0, -9, 7, 7, -7, 7, 0x246fe5);
    this.facingArrow.setStrokeStyle(1.2, 0x17324d);
    this.facingArrow.setAlpha(0.9);

    this.robotContainer.add([this.facingArrow, this.robotBody]);
    this.updateFacingCue(this.currentState.facing);
  }

  /** Swap the pose texture + foot arrow for a new logical facing. */
  private updateFacingCue(facing: Facing): void {
    this.robotBody?.setTexture(`rp-robot-${this.robotId}-${FACING_VIEW[facing]}`);
    if (!this.facingArrow) return;
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

  /**
   * Reset/snapshot handler. Kills any in-flight tweens first so late
   * callbacks cannot re-hide restored objects, then fully restores every
   * visual property the run animations touch (visibility, alpha, scale,
   * gate texture) — not just visibility (audit RPUX-005).
   */
  private snapToState(state: State): void {
    this.currentState = state;
    this.tweens.killTweensOf(this.robotContainer);

    const pos = toScreen(state.x, state.y);
    this.robotContainer.setPosition(pos.x, pos.y);
    this.robotContainer.setScale(1);
    this.robotContainer.setDepth(calculateDepth(state.x, state.y, 50));
    this.updateFacingCue(state.facing);

    // Restore collectibles completely
    const collectedSet = new Set(state.collected);
    for (const [id, sprite] of this.collectibleObjects.entries()) {
      this.tweens.killTweensOf(sprite);
      sprite.setAlpha(1);
      sprite.setScale(1);
      sprite.setVisible(!collectedSet.has(id));
    }

    // Restore gates: open gates show the open art, closed revert.
    const openGateSet = new Set(state.openedGates);
    for (const [id, sprite] of this.gateObjects.entries()) {
      this.tweens.killTweensOf(sprite);
      sprite.setAlpha(1);
      sprite.setScale(1);
      sprite.setTexture(openGateSet.has(id) ? 'rp-gate-open' : 'rp-gate-closed');
      sprite.setVisible(true);
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

    if (step.before.facing !== step.after.facing) {
      this.updateFacingCue(step.after.facing);
    }

    // Blocked: small stop/wobble at the current tile
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

    // Normal movement; depth follows the destination for correct sorting.
    this.robotContainer.setDepth(targetDepth);
    this.tweens.add({
      targets: this.robotContainer,
      x: targetPos.x,
      y: targetPos.y,
      duration: durationMs,
      ease: 'Cubic.easeInOut',
      onComplete: () => {
        this.currentState = step.after;

        for (const ev of step.events) {
          if (ev.kind === 'collect') {
            const item = this.collectibleObjects.get(ev.id);
            if (item) {
              this.tweens.add({
                targets: item,
                alpha: 0,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 180,
                onComplete: () => {
                  // Guard: a reset may have destroyed/restored this object.
                  if (item.active) item.setVisible(false);
                },
              });
            }
          } else if (ev.kind === 'open_gate') {
            const gate = this.gateObjects.get(ev.id);
            if (gate) {
              this.tweens.add({
                targets: gate,
                alpha: 0.25,
                duration: 200,
                onComplete: () => {
                  if (!gate.active) return;
                  gate.setTexture('rp-gate-open');
                  gate.setAlpha(1);
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
