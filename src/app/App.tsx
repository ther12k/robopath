import React, { useState, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
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
  /** Why the picker is open: first-time setup continues into play; later
   *  changes return to where the player came from (audit RPUX-006). */
  const [pickerIntent, setPickerIntent] = useState<'start' | 'return'>('start');

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
    // First-time: Welcome → pick your robot → first puzzle.
    // Returning players get the fast Continue path straight to the map.
    if (progress.completedLevels.length > 0) {
      setCurrentRoute('world-map');
    } else {
      setPickerIntent('start');
      setCurrentRoute('robot-picker');
    }
  };

  const handleSelectLevel = (levelId: string) => {
    setActiveLevelId(levelId);
    setCurrentRoute('game');
  };

  const handlePickerConfirm = () => {
    if (pickerIntent === 'start') {
      setActiveLevelId('w1-01');
      setCurrentRoute('game');
    } else {
      setCurrentRoute(progress.completedLevels.length > 0 ? 'world-map' : 'welcome');
    }
  };

  return (
    <MotionConfig reducedMotion="user">
    <div
      className="rp-sky-gradient"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {currentRoute === 'welcome' && (
        <WelcomeScreen
          progress={progress}
          onPlay={handleStartPlay}
          onChooseRobot={() => {
            setPickerIntent('return');
            setCurrentRoute('robot-picker');
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {currentRoute === 'robot-picker' && (
        <RobotPicker
          selectedRobotId={progress.selectedRobotId}
          confirmLabel={pickerIntent === 'start' ? "Let's Go! →" : 'Save Choice'}
          onSelectRobot={(robotId) => {
            handleUpdateProgress({ ...progress, selectedRobotId: robotId });
          }}
          onConfirm={handlePickerConfirm}
        />
      )}

      {currentRoute === 'world-map' && (
        <WorldMap
          progress={progress}
          onSelectLevel={handleSelectLevel}
          onOpenRobotPicker={() => {
            setPickerIntent('return');
            setCurrentRoute('robot-picker');
          }}
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
    </MotionConfig>
  );
};
