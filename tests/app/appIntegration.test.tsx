import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../../src/app/App';
import { InMemoryStorageAdapter } from '../../src/storage/storageAdapter';

// Mock PhaserGame so tests run quickly without WebGL requirements in jsdom
vi.mock('../../src/renderer/PhaserGame', () => ({
  PhaserGame: () => <div data-testid="mock-phaser-game">Phaser Board Mock</div>,
}));

describe('App full M1 journey integration (RP-015, RP-021)', () => {
  it('navigates from Welcome to Game, edits program and resets', async () => {
    const storage = new InMemoryStorageAdapter();

    render(<App storageAdapter={storage} />);

    // Wait for ready
    const title = await screen.findByRole('heading', { name: /Robo Paths/i });
    expect(title).toBeInTheDocument();

    // Start playing — first-time flow goes through robot selection (RPUX-006)
    const playBtn = screen.getByRole('button', { name: /Start Playing!/i });
    fireEvent.click(playBtn);

    // Picker appears; choose Bolt and confirm into the first puzzle
    await screen.findByRole('heading', { name: /Choose Your Robot/i });
    fireEvent.click(screen.getByRole('radio', { name: /Bolt/i }));
    fireEvent.click(screen.getByRole('button', { name: /Let's Go!/i }));

    // Should now be on Level 1 (First steps)
    const levelTitle = await screen.findByRole('heading', { name: /First steps/i });
    expect(levelTitle).toBeInTheDocument();

    // First level shows tutorial coach modal: dismiss it
    const tryItBtn = await screen.findByRole('button', { name: /Try It!/i });
    fireEvent.click(tryItBtn);

    // Add commands via editor (re-query each time: dnd wrappers remount)
    fireEvent.click(screen.getByRole('button', { name: /Add forward command/i }));
    fireEvent.click(screen.getByRole('button', { name: /Add forward command/i }));

    expect(screen.getByRole('group', { name: /Slot 1, forward/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /Slot 2, forward/i })).toBeInTheDocument();

    // Reset button
    const resetBtn = screen.getByRole('button', { name: /Reset to beginning/i });
    fireEvent.click(resetBtn);

    // Board explorer dialog
    const explorerBtn = screen.getByRole('button', { name: /Open Board Explorer/i });
    fireEvent.click(explorerBtn);

    const dialogTitle = await screen.findByRole('heading', { name: /Accessible Board Explorer/i });
    expect(dialogTitle).toBeInTheDocument();

    // Close dialog
    const closeBtn = screen.getByRole('button', { name: /Close dialog/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('heading', { name: /Accessible Board Explorer/i })).not.toBeInTheDocument();

    // Back to map
    const backBtn = screen.getByRole('button', { name: /Back to level map/i });
    fireEvent.click(backBtn);

    // World map header
    expect(await screen.findByRole('heading', { name: /Sunny Meadow/i })).toBeInTheDocument();
  });
});
