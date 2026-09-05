import { Howl } from 'howler';

export const sfx = {
  place: new Howl({ src: ['/audio/place.mp3'], volume: 0.4 }),
  run: new Howl({ src: ['/audio/run.mp3'], volume: 0.4 }),
  win: new Howl({ src: ['/audio/win.mp3'], volume: 0.5 }),
  fail: new Howl({ src: ['/audio/fail.mp3'], volume: 0.35 }),
};
