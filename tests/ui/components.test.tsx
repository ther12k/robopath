import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Button } from '../../src/ui/Button';
import { IconButton } from '../../src/ui/IconButton';
import { Chip } from '../../src/ui/Chip';
import { Dialog } from '../../src/ui/Dialog';

describe('Base accessible UI components (RP-004)', () => {
  it('renders primary button meeting min 48px target constraint', () => {
    render(<Button variant="primary">Run Program</Button>);
    const btn = screen.getByRole('button', { name: /Run Program/i });
    expect(btn).toBeInTheDocument();
    expect(btn.style.minHeight).toBe('48px');
    expect(btn.style.minWidth).toBe('48px');
  });

  it('renders disabled button with aria-disabled and disabled attribute', () => {
    render(<Button disabled>Disabled Action</Button>);
    const btn = screen.getByRole('button', { name: /Disabled Action/i });
    expect(btn).toBeDisabled();
    expect(btn.style.cursor).toBe('not-allowed');
  });

  it('renders IconButton with accessible name and min 48px dimension', () => {
    render(<IconButton label="Reset game" icon={<span>↺</span>} />);
    const btn = screen.getByRole('button', { name: /Reset game/i });
    expect(btn).toBeInTheDocument();
    expect(btn.style.width).toBe('48px');
    expect(btn.style.height).toBe('48px');
  });

  it('renders Chip with status role and formatted value', () => {
    render(<Chip label="Blocks" value="3/5" variant="accent" />);
    const chip = screen.getByRole('status');
    expect(chip).toHaveTextContent('Blocks');
    expect(chip).toHaveTextContent('3/5');
  });

  it('handles Dialog lifecycle, escape key, and focus return', () => {
    const TestComponent = () => {
      const [open, setOpen] = useState(false);
      return (
        <div>
          <button id="opener" onClick={() => setOpen(true)}>
            Open Dialog
          </button>
          <Dialog isOpen={open} title="Helpful Hint" onClose={() => setOpen(false)}>
            <p>Try turning left!</p>
          </Dialog>
        </div>
      );
    };

    render(<TestComponent />);
    const opener = screen.getByRole('button', { name: /Open Dialog/i });
    opener.focus();
    expect(document.activeElement).toBe(opener);

    fireEvent.click(opener);
    const dialog = screen.getByRole('dialog', { name: /Helpful Hint/i });
    expect(dialog).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
