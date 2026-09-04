import React from 'react';
import { Dialog } from '../../ui/Dialog';
import { Button } from '../../ui/Button';

export interface TutorialCoachProps {
  isOpen: boolean;
  concept: string;
  onClose: () => void;
}

export const TutorialCoach: React.FC<TutorialCoachProps> = ({ isOpen, concept, onClose }) => {
  const getTutorialContent = (c: string) => {
    switch (c) {
      case 'forward':
        return {
          title: 'How to Move Forward',
          instruction: 'The Forward command moves your robot one square ahead in the direction it faces!',
          icon: '⬆️',
        };
      case 'right-turn':
        return {
          title: 'Turning Right',
          instruction: 'The Turn Right command rotates your robot 90 degrees clockwise without changing tiles.',
          icon: '↷',
        };
      case 'left-turn':
        return {
          title: 'Turning Left',
          instruction: 'The Turn Left command rotates your robot 90 degrees counter-clockwise.',
          icon: '↶',
        };
      case 'required-pickup':
        return {
          title: 'Collecting Batteries',
          instruction: 'Batteries power your robot! Walk over the battery tile to collect it automatically.',
          icon: '⚡',
        };
      case 'optional-detour':
        return {
          title: 'Bonus Stars',
          instruction: 'Bonus stars are extra challenges! Detour to collect them, then reach the flag.',
          icon: '⭐',
        };
      case 'debug-blocked-route':
        return {
          title: 'Steering Around Rocks',
          instruction: 'Stone walls and rocks block the way. Plan a route around obstacles to reach your goal!',
          icon: '🧱',
        };
      case 'repeat':
      case 'repeat-count':
        return {
          title: 'Loops and Repetition',
          instruction: 'The Repeat command runs actions inside it multiple times! Saves precious program blocks.',
          icon: '🔁',
        };
      case 'switches':
      case 'gates':
        return {
          title: 'Switches and Gates',
          instruction: 'Step on floor switches to open gates! Gates remain open until the attempt resets.',
          icon: '🚪',
        };
      default:
        return {
          title: 'New Coding Concept',
          instruction: 'Arrange your commands carefully and press Run to watch your robot go!',
          icon: '🤖',
        };
    }
  };

  const info = getTutorialContent(concept);

  return (
    <Dialog
      isOpen={isOpen}
      title={info.title}
      onClose={onClose}
      footer={
        <Button variant="action" size="lg" fullWidth onClick={onClose}>
          Try It! →
        </Button>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
          padding: '8px 0',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            lineHeight: 1,
            padding: '16px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-sky)',
            border: '2px solid var(--color-primary)',
          }}
          aria-hidden="true"
        >
          {info.icon}
        </div>

        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-ink)', margin: 0, fontWeight: 500 }}>
          {info.instruction}
        </p>
      </div>
    </Dialog>
  );
};
