import { Howl } from 'howler';
import { sound } from './sound';

/**
 * Lightweight sound cues via Howler (kit recommendation).
 *
 * The kit snippet references pre-recorded mp3 files; this repo synthesizes
 * cues with the Web Audio API instead (zero asset weight, no autoplay
 * problems), so we keep Howler for management parity and fall back to the
 * synthesized `sound` manager until real samples are added under
 * public/assets/audio/.
 */

interface GameAudioCues {
  place: () => void;
  run: () => void;
  win: () => void;
  fail: () => void;
}

let howls: Record<keyof GameAudioCues, Howl> | null = null;

/** Lazily construct Howl handles; absent files simply never reach 'loaded'. */
function getHowls(): Record<keyof GameAudioCues, Howl> {
  if (!howls) {
    howls = {
      place: new Howl({ src: ['/assets/audio/place.mp3'], volume: 0.4 }),
      run: new Howl({ src: ['/assets/audio/run.mp3'], volume: 0.4 }),
      win: new Howl({ src: ['/assets/audio/win.mp3'], volume: 0.5 }),
      fail: new Howl({ src: ['/assets/audio/fail.mp3'], volume: 0.35 }),
    };
  }
  return howls;
}

function play(key: keyof GameAudioCues, fallback: () => void): void {
  const howl = getHowls()[key];
  if (howl.state() === 'loaded') {
    howl.play();
  } else {
    fallback();
  }
}

export function useGameAudio(): GameAudioCues {
  return {
    place: () => play('place', () => sound.playTap()),
    run: () => play('run', () => sound.playMove()),
    win: () => play('win', () => sound.playSuccess()),
    fail: () => play('fail', () => sound.playBlocked()),
  };
}
