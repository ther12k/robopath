import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { Level, State } from '../core/model';
import { AnimationAck } from '../bridge/messages';
import { GameScene } from './GameScene';

export interface PhaserGameProps {
  level: Level;
  robotId: string;
  currentState: State;
  onAcknowledgment: (ack: AnimationAck) => void;
  onMountScene?: (scene: GameScene) => void;
}

export const PhaserGame: React.FC<PhaserGameProps> = ({
  level,
  robotId,
  currentState,
  onAcknowledgment,
  onMountScene,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<GameScene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let sceneInstance: GameScene;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: '100%',
      height: '100%',
      backgroundColor: '#EFF9FD',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [
        class extends GameScene {
          constructor() {
            super();
            sceneInstance = this;
          }
        },
      ],
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.events.once('ready', () => {
      const activeScene = game.scene.getScene('GameScene') as GameScene || sceneInstance;
      sceneRef.current = activeScene;
      if (activeScene) {
        activeScene.init({ onAcknowledgment });
        activeScene.handleMessage({
          type: 'load',
          runId: 'init',
          level,
          robotId,
          state: currentState,
        });
        if (onMountScene) onMountScene(activeScene);
      }
    });

    return () => {
      sceneRef.current = null;
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '260px',
        backgroundColor: '#EFF9FD',
      }}
      role="application"
      aria-label="Isometric puzzle board view"
    />
  );
};
