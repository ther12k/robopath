#!/usr/bin/env node
/**
 * Generates directional robot pose SVGs (N/E/S/W) from the kit's front art.
 *
 * The front ("S") pose comes from the UI refresh kit; back and side views are
 * derived in the same flat-but-consistent style family with a shared foot
 * baseline (feet bottom at y=92, ground shadow at y=84) so all four poses sit
 * on the tile identically.
 *
 * These remain PLACEHOLDER art pending owner approval of a production set
 * (UI/UX audit RPUX-002); they exist so facing is conveyed by pose rather
 * than only the supplementary foot arrow.
 */
import { mkdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/assets/robots');
mkdirSync(outDir, { recursive: true });

const ROBOTS = [
  { id: 'pip',    shell: '#F9FDFF', panel: '#EDF5FA', stroke: '#A9BBCB', accent: '#4FA1FF', eye: '#69D3FF' },
  { id: 'mochi',  shell: '#FFE9F4', panel: '#FBD9E9', stroke: '#E8BFD2', accent: '#F472B6', eye: '#FFD9EC' },
  { id: 'bolt',   shell: '#FFF6C9', panel: '#FBEBA3', stroke: '#DFCB86', accent: '#F5B301', eye: '#A8D8F0' },
  { id: 'sprout', shell: '#F0FBE6', panel: '#E0F4CE', stroke: '#BFDDA6', accent: '#84CC16', eye: '#B7F0A0' },
];

const svg = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 96 96">${inner}</svg>`;

const ground = (r) =>
  `<ellipse cx="48" cy="84" rx="20" ry="6" fill="#DDEAF2"/>`;

const antenna = (r) =>
  `<rect x="45" y="10" width="6" height="10" rx="3" fill="${r.stroke}"/><circle cx="48" cy="10" r="5" fill="${r.accent}"/>`;

const arms = (r) =>
  `<rect x="14" y="58" width="18" height="8" rx="4" fill="${r.shell}" stroke="${r.stroke}" stroke-width="3" transform="rotate(-18 23 62)"/>` +
  `<rect x="64" y="58" width="18" height="8" rx="4" fill="${r.shell}" stroke="${r.stroke}" stroke-width="3" transform="rotate(18 73 62)"/>`;

const feet = (r) =>
  `<rect x="34" y="76" width="8" height="16" rx="4" fill="${r.shell}" stroke="${r.stroke}" stroke-width="3"/>` +
  `<rect x="54" y="76" width="8" height="16" rx="4" fill="${r.shell}" stroke="${r.stroke}" stroke-width="3"/>`;

/** Back view: no face, panel with vents and a status light. */
const backView = (r) => svg(
  ground(r) + antenna(r) +
  `<rect x="20" y="18" width="56" height="40" rx="14" fill="${r.shell}" stroke="${r.stroke}" stroke-width="3"/>` +
  `<rect x="30" y="26" width="36" height="24" rx="9" fill="${r.panel}" stroke="${r.stroke}" stroke-width="2"/>` +
  `<line x1="38" y1="34" x2="58" y2="34" stroke="${r.stroke}" stroke-width="2.5" stroke-linecap="round"/>` +
  `<line x1="38" y1="41" x2="52" y2="41" stroke="${r.stroke}" stroke-width="2.5" stroke-linecap="round"/>` +
  `<circle cx="60" cy="45" r="3" fill="${r.accent}"/>` +
  `<rect x="32" y="56" width="32" height="22" rx="10" fill="${r.shell}" stroke="${r.stroke}" stroke-width="3"/>` +
  arms(r) + feet(r)
);

/** Right-facing profile: one eye on the visible screen edge, backpack hint. */
const sideEastView = (r) => svg(
  ground(r) + antenna(r) +
  `<rect x="26" y="18" width="48" height="40" rx="14" fill="${r.shell}" stroke="${r.stroke}" stroke-width="3"/>` +
  `<rect x="20" y="26" width="10" height="22" rx="5" fill="${r.panel}" stroke="${r.stroke}" stroke-width="2"/>` + // backpack
  `<rect x="44" y="25" width="24" height="24" rx="9" fill="#18324D"/>` +
  `<circle cx="56" cy="36" r="4" fill="${r.eye}"/>` +
  `<path d="M52 43 C55 45.5 59 45.5 62 43" stroke="${r.eye}" stroke-width="2.5" fill="none" stroke-linecap="round"/>` +
  `<rect x="32" y="56" width="32" height="22" rx="10" fill="${r.shell}" stroke="${r.stroke}" stroke-width="3"/>` +
  `<rect x="62" y="58" width="18" height="8" rx="4" fill="${r.shell}" stroke="${r.stroke}" stroke-width="3" transform="rotate(18 71 62)"/>` + // leading arm
  feet(r)
);

/** Left-facing profile: mirrored east view. */
const sideWestView = (r) =>
  svg(`<g transform="translate(96,0) scale(-1,1)">${sideEastViewInner(r)}</g>`);

// sideEastView returns a full svg(); factor its inner markup for mirroring.
function sideEastViewInner(r) {
  const full = sideEastView(r);
  return full.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
}

for (const r of ROBOTS) {
  writeFileSync(resolve(outDir, `${r.id}-n.svg`), backView(r));
  writeFileSync(resolve(outDir, `${r.id}-e.svg`), sideEastView(r));
  writeFileSync(resolve(outDir, `${r.id}-w.svg`), sideWestView(r));
  // Uniform key scheme: S reuses the approved kit front art.
  cpSync(resolve(outDir, `${r.id}-front.svg`), resolve(outDir, `${r.id}-s.svg`));
  console.log(`poses written for ${r.id}`);
}
console.log('done');
