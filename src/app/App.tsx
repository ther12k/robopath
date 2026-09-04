import React, { useState, useEffect } from 'react';
import { PlayerProgress, createInitialProgress } from '../core/progression';
import { LocalStorageAdapter, StorageAdapter } from '../storage/storageAdapter';
import { WelcomeScreen } from '../features/welcome/WelcomeScreen';
import { RobotPicker } from '../features/robots/RobotPicker';
import { WorldMap } from '../features/worlds/WorldMap';
import { GameScreen } from '../features/gameplay/GameScreen';
import { SettingsModal } from '../features/settings/SettingsModal';

export type ScreenRoute = 'welcome' | 'robot-picker' | 'world-map' | 'game';

export interface AppProps {
  storageAdapter?: StorageAdapter;
}

export const App: React.FC<AppProps> = ({ storageAdapter }) => {
  const [storage] = useState<StorageAdapter>(() => storageAdapter || new LocalStorageAdapter());
  const [progress, setProgress] = useState<PlayerProgress>(createInitialProgress());
  const [currentRoute, setCurrentRoute] = useState<ScreenRoute>('welcome');
  const [activeLevelId, setActiveLevelId] = useState<string>('w1-01');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    storage.loadProgress().then((loaded) => {
      setProgress(loaded);
      setIsReady(true);
    });
  }, [storage]);

  if (!isReady) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100dvh',
          color: 'var(--color-primary)',
          fontSize: 'var(--text-lg)',
          fontWeight: 700,
        }}
      >
        Loading Robo Paths...
      </div>
    );
  }

  const handleUpdateProgress = (next: PlayerProgress) => {
    setProgress(next);
    storage.saveProgress(next).catch(console.error);
  };

  const handleStartPlay = () => {
    // If player has already made progress, go to world map; otherwise first level
    if (progress.completedLevels.length > 0) {
      setCurrentRoute('world-map');
    } else {
      setActiveLevelId('w1-01');
      setCurrentRoute('game');
    }
  };

  const handleSelectLevel = (levelId: string) => {
    setActiveLevelId(levelId);
    setCurrentRoute('game');
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--color-sky)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {currentRoute === 'welcome' && (
        <WelcomeScreen
          progress={progress}
          onPlay={handleStartPlay}
          onChooseRobot={() => setCurrentRoute('robot-picker')}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {currentRoute === 'robot-picker' && (
        <RobotPicker
          selectedRobotId={progress.selectedRobotId}
          onSelectRobot={(robotId) => {
            handleUpdateProgress({ ...progress, selectedRobotId: robotId });
          }}
          onConfirm={() => {
            // Return to previous or go to world map
            if (progress.completedLevels.length > 0) {
              setCurrentRoute('world-map');
            } else {
              setCurrentRoute('welcome');
            }
          }}
        />
      )}

      {currentRoute === 'world-map' && (
        <WorldMap
          progress={progress}
          onSelectLevel={handleSelectLevel}
          onOpenRobotPicker={() => setCurrentRoute('robot-picker')}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {currentRoute === 'game' && (
        <GameScreen
          levelId={activeLevelId}
          progress={progress}
          storage={storage}
          onUpdateProgress={handleUpdateProgress}
          onBackToMap={() => setCurrentRoute('world-map')}
          onSelectLevel={handleSelectLevel}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        progress={progress}
        storage={storage}
        onUpdateProgress={handleUpdateProgress}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
