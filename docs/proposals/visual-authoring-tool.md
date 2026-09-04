# Internal Visual Level Authoring Tool Proposal

**Status:** Technical Architecture & Design (M5 Scope)  
**Task:** RP-053

---

## 1. Goal

An internal, web-based visual editor allowing level designers and educators to click-to-place tiles, walls, switches, gates, batteries, and flags, configure block/action caps, test intended solutions in real-time, and export valid level JSON matching `schemas/level.schema.json`.

---

## 2. Shared Core Architecture

The authoring tool must never fork the simulator or invent a secondary rules engine:
1. **Direct Core Validator Integration:** Every tile or entity placement executes `validateLevel()` from `src/core/validate.ts`. Instant feedback is displayed on invalid coordinate overlaps, missing gate targets, or start/goal conflicts.
2. **Integrated Solution Witness Runner:** The author builds a draft program and tests it with `simulate()`. The tool verifies reachability and 3-star attainability before allowing the level to be exported.
3. **Strict JSON Export:** The exported artifact matches `schemas/level.schema.json` with deterministic key ordering and coordinate formatting.

---

## 3. UI Layout

- **Left Canvas:** Interactive isometric tile grid with tool selector (Pencil: Walkable Tile, Eraser: Void, Wall, Flag, Battery, Star, Switch, Gate).
- **Right Inspector Panel:**
  - Level metadata: ID, World, Title Key, Concept, Archetype, Difficulty.
  - Limits & Budget: Max Blocks, Max Actions, Par Blocks.
  - Allowed commands selector (Forward, Left, Right, Repeat).
  - Authored Hint Keys (Tier 1, Tier 2, Tier 3).
  - "Test Run" button and "Export Level JSON" button.
