import * as Phaser from 'phaser';
import { Facing, Level, State, Step } from '../core/model';
import { AnimationAck, SceneMessage } from '../bridge/messages';
import { toScreen, calculateDepth, calculateBoardBounds } from './projection';
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
  private robotSprite!: Phaser.GameObjects.Arc;
  private facingArrow!: Phaser.GameObjects.Triangle;
  private collectibleObjects: Map<string, Phaser.GameObjects.GameObject> = new Map();
  private gateObjects: Map<string, Phaser.GameObjects.Container> = new Map();

  constructor() {
    super({ key: 'GameScene' });
  }

  public init(data: GameSceneConfig): void {
    this.onAcknowledgment = data.onAcknowledgment;
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#EFF9FD');
    this.boardContainer = this.add.container(0, 0);

    // If level is already configured, render it
    if (this.level) {
      this.buildBoard();
    }
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

    // Render ground tiles
    for (const tile of tiles) {
      const screenPos = toScreen(tile.x, tile.y);
      const isWall = wallSet.has(`${tile.x},${tile.y}`);
      const depth = calculateDepth(tile.x, tile.y, 0);

      // Tile base/slab
      const tileGfx = this.add.graphics();
      tileGfx.setDepth(depth);

      // Diamond ground polygon
      const points = [
        { x: screenPos.x, y: screenPos.y - 16 },
        { x: screenPos.x + 32, y: screenPos.y },
        { x: screenPos.x, y: screenPos.y + 16 },
        { x: screenPos.x - 32, y: screenPos.y },
      ];

      // Isometric tile top
      tileGfx.fillStyle(0x7ac943, 1);
      tileGfx.beginPath();
      tileGfx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        tileGfx.lineTo(points[i].x, points[i].y);
      }
      tileGfx.closePath();
      tileGfx.fillPath();
      tileGfx.lineStyle(1.5, 0x5a9e2d, 1);
      tileGfx.strokePath();

      // Isometric tile edge (depth slab)
      tileGfx.fillStyle(0x4a8222, 1);
      tileGfx.beginPath();
      tileGfx.moveTo(screenPos.x - 32, screenPos.y);
      tileGfx.lineTo(screenPos.x, screenPos.y + 16);
      tileGfx.lineTo(screenPos.x + 32, screenPos.y);
      tileGfx.lineTo(screenPos.x + 32, screenPos.y + 12);
      tileGfx.lineTo(screenPos.x, screenPos.y + 28);
      tileGfx.lineTo(screenPos.x - 32, screenPos.y + 12);
      tileGfx.closePath();
      tileGfx.fillPath();

      this.boardContainer.add(tileGfx);

      // If wall, draw stone block on top
      if (isWall) {
        const wallDepth = calculateDepth(tile.x, tile.y, 30);
        const wallGfx = this.add.graphics();
        wallGfx.setDepth(wallDepth);

        // Stone block
        wallGfx.fillStyle(0x94a3b8, 1);
        wallGfx.fillRect(screenPos.x - 20, screenPos.y - 36, 40, 36);
        wallGfx.lineStyle(2, 0x475569, 1);
        wallGfx.strokeRect(screenPos.x - 20, screenPos.y - 36, 40, 36);

        this.boardContainer.add(wallGfx);
      }
    }

    // Render Goal Flag
    const goalPos = toScreen(this.level.goal.x, this.level.goal.y);
    const goalDepth = calculateDepth(this.level.goal.x, this.level.goal.y, 25);
    const goalGfx = this.add.graphics();
    goalGfx.setDepth(goalDepth);

    // Flag pole
    goalGfx.lineStyle(3, 0x64748b, 1);
    goalGfx.lineBetween(goalPos.x + 10, goalPos.y, goalPos.x + 10, goalPos.y - 32);

    // Flag cloth
    goalGfx.fillStyle(0xef4444, 1);
    goalGfx.beginPath();
    goalGfx.moveTo(goalPos.x + 10, goalPos.y - 32);
    goalGfx.lineTo(goalPos.x - 10, goalPos.y - 24);
    goalGfx.lineTo(goalPos.x + 10, goalPos.y - 16);
    goalGfx.closePath();
    goalGfx.fillPath();

    this.boardContainer.add(goalGfx);

    // Render Switches
    for (const sw of this.level.switches) {
      const swPos = toScreen(sw.x, sw.y);
      const swDepth = calculateDepth(sw.x, sw.y, 5);
      const swGfx = this.add.graphics();
      swGfx.setDepth(swDepth);

      swGfx.fillStyle(0xf59e0b, 1);
      swGfx.fillCircle(swPos.x, swPos.y, 12);
      swGfx.lineStyle(2, 0xd97706, 1);
      swGfx.strokeCircle(swPos.x, swPos.y, 12);

      this.boardContainer.add(swGfx);
    }

    // Render Gates
    for (const g of this.level.gates) {
      const gPos = toScreen(g.x, g.y);
      const gDepth = calculateDepth(g.x, g.y, 20);

      const gateContainer = this.add.container(gPos.x, gPos.y);
      gateContainer.setDepth(gDepth);

      const gateGfx = this.add.graphics();
      // Pillars
      gateGfx.fillStyle(0x7c3aed, 1);
      gateGfx.fillRect(-18, -32, 8, 32);
      gateGfx.fillRect(10, -32, 8, 32);
      // Beam
      gateGfx.fillRect(-18, -32, 36, 8);

      gateContainer.add(gateGfx);
      this.gateObjects.set(g.id, gateContainer);
      this.boardContainer.add(gateContainer);
    }

    // Render Collectibles (batteries & stars)
    for (const item of this.level.collectibles) {
      const itemPos = toScreen(item.x, item.y);
      const itemDepth = calculateDepth(item.x, item.y, 15);

      const itemGfx = this.add.graphics();
      itemGfx.setDepth(itemDepth);

      if (item.kind === 'required') {
        // Battery
        itemGfx.fillStyle(0x38bdf8, 1);
        itemGfx.fillRoundedRect(itemPos.x - 10, itemPos.y - 18, 20, 24, 4);
        itemGfx.lineStyle(2, 0x0284c7, 1);
        itemGfx.strokeRoundedRect(itemPos.x - 10, itemPos.y - 18, 20, 24, 4);
        // Battery terminal
        itemGfx.fillStyle(0xf8fafc, 1);
        itemGfx.fillRect(itemPos.x - 4, itemPos.y - 22, 8, 4);
      } else {
        // Bonus Star
        itemGfx.fillStyle(0xfbbf24, 1);
        itemGfx.fillCircle(itemPos.x, itemPos.y - 8, 10);
        itemGfx.lineStyle(2, 0xd97706, 1);
        itemGfx.strokeCircle(itemPos.x, itemPos.y - 8, 10);
      }

      this.collectibleObjects.set(item.id, itemGfx);
      this.boardContainer.add(itemGfx);
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

    // Directional foot indicator
    this.facingArrow = this.add.triangle(0, 4, 0, -10, 8, 8, -8, 8, 0x246fe5);
    this.facingArrow.setStrokeStyle(1.5, 0x17324d);
    this.updateFacingArrow(this.currentState.facing);

    // Robot body circle
    const colorHex = parseInt(robot.primaryColor.replace('#', '0x'), 16);
    this.robotSprite = this.add.circle(0, -16, 14, colorHex);
    this.robotSprite.setStrokeStyle(2.5, 0x17324d);

    // Robot face screen
    const faceHex = parseInt(robot.faceColor.replace('#', '0x'), 16);
    const screenGfx = this.add.graphics();
    screenGfx.fillStyle(0x17324d, 1);
    screenGfx.fillRoundedRect(-10, -22, 20, 12, 3);
    // Eyes
    screenGfx.fillStyle(faceHex, 1);
    screenGfx.fillCircle(-4, -16, 2.5);
    screenGfx.fillCircle(4, -16, 2.5);

    // Robot antenna
    const accentHex = parseInt(robot.accentColor.replace('#', '0x'), 16);
    const antennaGfx = this.add.graphics();
    antennaGfx.fillStyle(accentHex, 1);
    antennaGfx.fillCircle(0, -32, 3.5);
    antennaGfx.lineStyle(2, 0x17324d, 1);
    antennaGfx.lineBetween(0, -30, 0, -32);

    this.robotContainer.add([this.facingArrow, this.robotSprite, screenGfx, antennaGfx]);
    this.boardContainer.add(this.robotContainer);
  }

  private updateFacingArrow(facing: Facing): void {
    switch (facing) {
      case 'N':
        this.facingArrow.setRotation(-Math.PI / 4);
        break;
      case 'E':
        this.facingArrow.setRotation(Math.PI / 4);
        break;
      case 'S':
        this.facingArrow.setRotation((3 * Math.PI) / 4);
        break;
      case 'W':
        this.facingArrow.setRotation((-3 * Math.PI) / 4);
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

    // Restore gates
    const openGateSet = new Set(state.openedGates);
    for (const [id, obj] of this.gateObjects.entries()) {
      (obj as any).setVisible(!openGateSet.has(id));
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
              this.tweens.add({
                targets: gateObj,
                alpha: 0,
                duration: 200,
                onComplete: () => (gateObj as any).setVisible(false),
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
    const bounds = calculateBoardBounds(this.level.board.width, this.level.board.height);
    const camera = this.cameras.main;

    const zoomX = camera.width / bounds.width;
    const zoomY = camera.height / bounds.height;
    const zoom = Math.min(zoomX, zoomY, 1.6);

    camera.setZoom(Math.max(zoom * 0.85, 0.6));
    camera.centerOn((bounds.minX + bounds.maxX) / 2, (bounds.minY + bounds.maxY) / 2);
  }
}
