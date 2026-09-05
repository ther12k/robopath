/**
 * Multi-tab coordination and safe service-worker updates (RP-037).
 *
 * TabCoordinator uses a BroadcastChannel so several open tabs agree on who
 * owns the active editor, receive erase generation markers (a stale tab can
 * never resurrect erased progress), and see draft revision bumps.
 *
 * UpdateCoordinator never calls skipWaiting/reload in the middle of a robot
 * action: the app registers a "safe boundary" predicate, and the waiting
 * worker is only activated once every tab reports it is safe.
 *
 * The channel and registration objects are injectable for unit testing.
 */

export type TabMessage =
  | { type: 'tab-active'; tabId: string; at: number }
  | { type: 'draft-changed'; tabId: string; levelId: string; revision: number }
  | { type: 'erase-generation'; tabId: string; generation: number }
  | { type: 'update-safe'; tabId: string };

export interface ChannelLike {
  postMessage(message: TabMessage): void;
  subscribe(listener: (message: TabMessage) => void): () => void;
  close(): void;
}

export interface ServiceWorkerLike {
  state: 'installing' | 'installed' | 'activating' | 'activated' | 'redundant';
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
}

export interface RegistrationLike {
  waiting: ServiceWorkerLike | null;
  active: ServiceWorkerLike | null;
  addEventListener(type: string, listener: () => void): void;
}

export class TabCoordinator {
  private readonly tabId: string;
  private channel: ChannelLike | null;
  private listeners = new Set<(msg: TabMessage) => void>();
  private currentGeneration = 0;

  constructor(channelFactory: (() => ChannelLike | null) | ChannelLike | null) {
    this.tabId = `tab-${Math.random().toString(36).slice(2, 10)}`;
    const channel = typeof channelFactory === 'function' ? channelFactory() : channelFactory;
    this.channel = channel && typeof channel.postMessage === 'function' ? channel : null;
    // Incoming remote messages are dispatched through receive().
    this.channel?.subscribe((msg) => {
      if (this.receive(msg)) {
        for (const listener of this.listeners) listener(msg);
      }
    });
  }

  getId(): string {
    return this.tabId;
  }

  announceActive(): void {
    this.send({ type: 'tab-active', tabId: this.tabId, at: Date.now() });
  }

  announceDraft(levelId: string, revision: number): void {
    this.send({ type: 'draft-changed', tabId: this.tabId, levelId, revision });
  }

  /** Broadcast (and locally apply) an erase generation marker. */
  announceErase(generation: number): void {
    this.currentGeneration = Math.max(this.currentGeneration, generation);
    this.send({ type: 'erase-generation', tabId: this.tabId, generation });
  }

  getGeneration(): number {
    return this.currentGeneration;
  }

  /** Applies a remote message. Returns true if the message was for this tab to act on. */
  receive(msg: TabMessage): boolean {
    if (msg.tabId === this.tabId) return false;
    switch (msg.type) {
      case 'erase-generation':
        this.currentGeneration = Math.max(this.currentGeneration, msg.generation);
        return true;
      case 'draft-changed':
      case 'tab-active':
      case 'update-safe':
        return true;
    }
  }

  onMessage(listener: (msg: TabMessage) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  announceUpdateSafe(): void {
    this.send({ type: 'update-safe', tabId: this.tabId });
  }

  destroy(): void {
    this.listeners.clear();
    this.channel?.close();
    this.channel = null;
  }

  private send(msg: TabMessage): void {
    try {
      this.channel?.postMessage(msg);
    } catch {
      // A closed channel must never break gameplay.
    }
  }
}

export type UpdateSafetyPredicate = () => boolean;

export class UpdateCoordinator {
  private readonly registration: RegistrationLike;
  private readonly isSafeBoundary: UpdateSafetyPredicate;
  private onUpdateReady: (() => void) | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private activated = false;

  constructor(registration: RegistrationLike, isSafeBoundary: UpdateSafetyPredicate) {
    this.registration = registration;
    this.isSafeBoundary = isSafeBoundary;
  }

  /** Starts watching for a waiting worker. Calls back at the first safe boundary. */
  watch(onUpdateReady: () => void): void {
    this.onUpdateReady = onUpdateReady;
    this.registration.addEventListener('updatefound', () => this.checkWaiting());
    this.checkWaiting();
    // Safety nets do not exist on all platforms; poll as a fallback.
    this.pollTimer = setInterval(() => this.checkWaiting(), 2000);
  }

  private checkWaiting(): void {
    const waiting = this.registration.waiting;
    if (!waiting || waiting.state !== 'installed' || this.activated) return;
    if (!this.isSafeBoundary()) return; // Never mid-run: wait for a safe boundary.
    this.activated = true;
    this.stop();
    waiting.state = 'activating';
    this.onUpdateReady?.();
  }

  /** Explicit user confirmation also permits activation at the next check. */
  confirmActivateNow(): void {
    this.activated = true;
    this.stop();
    const waiting = this.registration.waiting;
    if (waiting) waiting.state = 'activating';
    this.onUpdateReady?.();
  }

  isUpdateReady(): boolean {
    return this.activated;
  }

  stop(): void {
    if (this.pollTimer !== null) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  destroy(): void {
    this.stop();
    this.onUpdateReady = null;
  }
}
