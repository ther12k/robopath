import { describe, it, expect, vi } from 'vitest';
import {
  TabCoordinator,
  UpdateCoordinator,
  ChannelLike,
  TabMessage,
  RegistrationLike,
  ServiceWorkerLike,
} from '../../src/offline/multiTab';

class LoopbackChannel implements ChannelLike {
  peers: LoopbackChannel[] = [];
  subscribers: Array<(message: TabMessage) => void> = [];
  closed = false;

  postMessage(message: TabMessage): void {
    for (const peer of this.peers) {
      for (const subscriber of peer.subscribers) subscriber(message);
    }
  }
  subscribe(listener: (message: TabMessage) => void): () => void {
    this.subscribers.push(listener);
    return () => {
      this.subscribers = this.subscribers.filter((l) => l !== listener);
    };
  }
  close(): void {
    this.closed = true;
  }
  connect(peer: LoopbackChannel): void {
    this.peers.push(peer);
    peer.peers.push(this);
  }
}

function makeWorker(state: ServiceWorkerLike['state']): ServiceWorkerLike {
  const listeners: Record<string, Array<() => void>> = {};
  return {
    state,
    addEventListener(type, listener) {
      (listeners[type] ??= []).push(listener);
    },
    removeEventListener(type, listener) {
      listeners[type] = (listeners[type] ?? []).filter((l) => l !== listener);
    },
  };
}

function makeRegistration(waiting: ServiceWorkerLike | null): RegistrationLike & {
  emitUpdateFound(): void;
} {
  const listeners: Record<string, Array<() => void>> = {};
  return {
    waiting,
    active: waiting ? makeWorker('activated') : null,
    addEventListener(type, listener) {
      (listeners[type] ??= []).push(listener);
    },
    emitUpdateFound() {
      for (const l of listeners['updatefound'] ?? []) l();
    },
  };
}

describe('Multi-tab coordination (RP-037)', () => {
  it('delivers draft-change and erase-generation markers between tabs', () => {
    const channelA = new LoopbackChannel();
    const channelB = new LoopbackChannel();
    channelA.connect(channelB);

    const tabA = new TabCoordinator(channelA);
    const tabB = new TabCoordinator(channelB);

    const seenByB: TabMessage[] = [];
    const off = tabB.onMessage((msg) => seenByB.push(msg));

    tabA.announceDraft('w2-03', 7);
    expect(seenByB.some((m) => m.type === 'draft-changed' && m.revision === 7)).toBe(true);

    tabA.announceErase(3);
    expect(tabB.getGeneration()).toBe(3);

    off();
    tabA.announceActive();
    expect(seenByB.some((m) => m.type === 'tab-active')).toBe(false);
  });

  it('ignores its own messages and never throws on a closed channel', () => {
    const tab = new TabCoordinator(new LoopbackChannel());
    expect(tab.receive({ type: 'tab-active', tabId: tab.getId(), at: 1 })).toBe(false);
    expect(tab.receive({ type: 'erase-generation', tabId: 'other', generation: 5 })).toBe(true);
    expect(tab.getGeneration()).toBe(5);

    tab.destroy();
    expect(() => tab.announceActive()).not.toThrow();
  });

  it('erased generation is monotonic — a stale tab cannot lower it', () => {
    const tab = new TabCoordinator(new LoopbackChannel());
    tab.announceErase(4);
    tab.receive({ type: 'erase-generation', tabId: 'x', generation: 2 });
    expect(tab.getGeneration()).toBe(4);
  });

  it('a null channel (unsupported environment) degrades silently', () => {
    const tab = new TabCoordinator(null);
    expect(() => {
      tab.announceActive();
      tab.announceDraft('w1-01', 1);
      tab.announceErase(1);
    }).not.toThrow();
  });
});

describe('Safe service-worker update waiting (RP-037)', () => {
  it('never activates mid-run; fires only at a safe boundary', () => {
    vi.useFakeTimers();
    let safe = false;
    const waiting = makeWorker('installed');
    const reg = makeRegistration(waiting);
    const coordinator = new UpdateCoordinator(reg, () => safe);

    const onReady = vi.fn();
    coordinator.watch(onReady);

    // Not safe yet (mid-run): poll must not activate.
    vi.advanceTimersByTime(5000);
    expect(onReady).not.toHaveBeenCalled();
    expect(waiting.state).toBe('installed');

    // Playback ends — the next check activates.
    safe = true;
    vi.advanceTimersByTime(2500);
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(waiting.state).toBe('activating');

    coordinator.destroy();
    vi.useRealTimers();
  });

  it('does not activate a redundant or missing worker', () => {
    vi.useFakeTimers();
    const reg = makeRegistration(makeWorker('redundant'));
    const coordinator = new UpdateCoordinator(reg, () => true);
    const onReady = vi.fn();
    coordinator.watch(onReady);
    vi.advanceTimersByTime(10000);
    expect(onReady).not.toHaveBeenCalled();
    coordinator.destroy();
    vi.useRealTimers();
  });

  it('explicit confirmation activates immediately even if unsafe', () => {
    const waiting = makeWorker('installed');
    const reg = makeRegistration(waiting);
    const coordinator = new UpdateCoordinator(reg, () => false);
    const onReady = vi.fn();
    coordinator.watch(onReady);
    coordinator.confirmActivateNow();
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(waiting.state).toBe('activating');
    coordinator.destroy();
  });
});
