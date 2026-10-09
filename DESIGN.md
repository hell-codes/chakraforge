# DESIGN SYSTEM SPECIFICATION — CHAKRAFORGE (Chakravyūha)

**Stitch Project**: `Chakravyuha` (`projects/75781549578607362`)  
**Product**: CHAKRAFORGE — 3D Multi-Agent Strategic Coordination Simulator Under Incomplete Information  
**Aesthetic Theme**: *Ancient Indian Epic Heritage × Modern Computational Laboratory (Dark Tactical Glassmorphism)*  
**Specification File**: `DESIGN.md`  

---

## 1. Design Philosophy & Creative Vision

CHAKRAFORGE bridges **primary historical-narrative heritage** (*Mahābhārata, Droṇa Parva, 13th Day Chakravyūha*) with **rigorous computational multi-agent science** (POMDP formulation, dynamic concentric geometry, explainable AI).

The visual language follows three foundational pillars:
1. **Sacred Geometry & Vedic Tonal Archetypes**: Dark earth, obsidian slate, smoked parchment, weathered bronze, and consecrated ritual gold (`#d4af37`).
2. **Scientific Precision & Telemetric Clarity**: High-contrast, clean sans-serif typography (`Inter`) paired with fixed-width data readouts (`JetBrains Mono`), high-visibility vector paths, and HUD overlays.
3. **Layered Depth & Glassmorphic Elevation**: Multilevel dark glass panels (`backdrop-blur-md` to `backdrop-blur-xl`), subtle metallic borders with 18% to 65% alpha gold glows, and distinct spatial hierarchy over a full WebGL 3D battlefield canvas.

---

## 2. Color System & Design Tokens

### 2.1 Color Tokens & Hex Swatches

| Category | Token Name | Hex / RGBA Value | Role / Application |
| :--- | :--- | :--- | :--- |
| **Background** | `--bg-deep` | `#0c0907` | Global canvas, root background (charcoal obsidian) |
| **Background** | `--bg-surface` | `#140f0b` | Base card background, dropdowns, resting surfaces |
| **Background** | `--bg-surface-elevated` | `#1d1611` | Hovered cards, active inspector panels, modal drawers |
| **Overlay** | `--bg-overlay` | `rgba(16, 12, 9, 0.92)` | Glassmorphic HUDs, floating telemetry, control bars |
| **Border** | `--border-subtle` | `rgba(212, 175, 55, 0.18)` | Resting card borders, subtle grid dividers |
| **Border** | `--border-gold` | `rgba(212, 175, 55, 0.35)` | Interactive element borders, header bottom line |
| **Border** | `--border-gold-glow` | `rgba(212, 175, 55, 0.65)` | Active selection borders, Abhimanyu Inspector outline |
| **Gold Primary** | `--gold-primary` | `#d4af37` | Primary brand accent, focus states, heroic icons |
| **Gold Light** | `--gold-light` | `#f5e6b8` | Button hover highlights, golden titles, gradient stops |
| **Gold Dark** | `--gold-dark` | `#917224` | Inactive gold tabs, pressed states, subtle accents |
| **Heritage Bronze**| `--bronze` | `#a37a3e` | Secondary borders, auxiliary badges, tier rings |
| **Heritage Copper**| `--copper` | `#c07a4a` | Perimeter braziers, earthen highlights, secondary agents |
| **Ritual Crimson** | `--crimson-accent` | `#b83227` | Breach seal indicators, elimination badges, warnings |
| **Parchment** | `--parchment` | `#e8dfd1` | Historical monograph excerpts, classical quotes |
| **Text Primary** | `--text-primary` | `#f5f1eb` | Main headings, modal titles, high-emphasis text |
| **Text Secondary** | `--text-secondary` | `#c5bcb1` | Paragraph descriptions, metric labels, inactive tabs |
| **Text Muted** | `--text-muted` | `#8e8376` | Timestamp markers, footnotes, subtle breadcrumbs |

### 2.2 Semantic & State Accents

| State / Meaning | Hex Code | Purpose in UI & 3D Visualizer |
| :--- | :--- | :--- |
| **Historical Mode** | `#d4af37` (Gold) | Default historical scenario, canonical markers |
| **Counterfactual Mode** | `#22d3ee` (Cyan) | What-If simulation mode, candidate escape paths |
| **Success / Validated** | `#10b981` (Emerald) | Escape path confirmation, test pass, high coordination |
| **Warning / Isolated** | `#f59e0b` (Amber) | Abhimanyu isolated inside tier 4-7, packet delay |
| **Critical / Severed** | `#ef4444` (Rose Red) | Jayadratha entrance seal, blocked reinforcement, elimination |
| **Communication Wave** | `#60a5fa` (Sky Blue) | Inter-agent coordination signal pulses in 3D scene |

---

## 3. Typography Hierarchy

The type system balances classical grandeur, modern readability, and mathematical notation.

```
Headings & Display  →  Cinzel (Serif, weights 600, 700, 900)
Body & Interfaces   →  Inter (Sans-Serif, weights 400, 500, 600)
Data & Coordinates  →  JetBrains Mono (Monospace, weights 400, 500, 600)
```

### 3.1 Type Scale

| Level | Font Family | Size | Weight | Tracking / Line Height | Used In |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Title** | `Cinzel` | `3.75rem` - `4.5rem` (60-72px) | 900 Black | `0.05em` / `1.1` | Hero Title: `CHAKRAFORGE` |
| **Subtitle H1** | `Cinzel` | `1.75rem` - `2.25rem` (28-36px) | 700 Bold | `0.04em` / `1.25` | Section Headers, Landing Hero |
| **Section H2** | `Cinzel` | `1.25rem` - `1.5rem` (20-24px) | 700 Bold | `0.03em` / `1.3` | Panel Titles, Modal Headers |
| **Subheading H3** | `Cinzel` | `1.0rem` - `1.125rem` (16-18px) | 600 SemiBold| `0.02em` / `1.4` | Card titles, Inspector headers |
| **Body Large** | `Inter` | `1.0rem` (16px) | 400 Regular | Normal / `1.6` | Hero lead text, Story descriptions |
| **Body Regular** | `Inter` | `0.875rem` (14px) | 400 Regular | Normal / `1.5` | Monograph passages, instructions |
| **Body Small / UI** | `Inter` | `0.75rem` (12px) | 500 Medium | Normal / `1.4` | Form labels, button text, tooltips |
| **Telemetry Mono** | `JetBrains Mono` | `0.75rem` (12px) | 500 Medium | `0.02em` / `1.3` | Coordinates `(X, Y)`, Steps, Score % |
| **Micro Badge** | `JetBrains Mono` | `0.5625rem` (9px) | 600 SemiBold| `0.08em` / `1.0` | `RESEARCH`, `POMDP`, `HISTORICAL` |

---

## 4. Spacing, Elevation & Surface Architecture

### 4.1 Spatial Rhythm (8pt System)
- **Space 1** (`4px`): Micro badge padding, inline icon spacing
- **Space 2** (`8px`): Compact button padding, stack gap
- **Space 3** (`12px`): Input padding, card internal spacing
- **Space 4** (`16px`): Standard panel padding, toolbar gap
- **Space 6** (`24px`): Section gap, modal padding
- **Space 8** (`32px`): Layout column gutters
- **Space 12** (`48px`): Sub-section vertical division
- **Space 16** (`64px`): Major landing page vertical rhythm

### 4.2 Elevation, Glassmorphism & Radii

```css
/* Card Surface */
.surface-card {
  background-color: #140f0b;
  border: 1px solid rgba(212, 175, 55, 0.18);
  border-radius: 12px;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6);
}

/* Elevated Surface (Active / Hovered) */
.surface-elevated {
  background-color: #1d1611;
  border: 1px solid rgba(212, 175, 55, 0.35);
  border-radius: 12px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.7);
}

/* Floating Glass Overlay (HUD / Telemetry) */
.surface-panel {
  background: rgba(16, 12, 9, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(212, 175, 55, 0.18);
  border-radius: 10px;
}
```

### 4.3 Corner Radii Scale
- `rounded-sm`: `4px` (Badges, small tags)
- `rounded-md`: `8px` (Buttons, inputs, icon boxes)
- `rounded-lg`: `10px` (HUD panels, floating controllers)
- `rounded-xl`: `12px` (Cards, drawers, modals)
- `rounded-full`: `9999px` (Status dots, pill badges, avatars)

---

## 5. UI Component Catalog

### 5.1 Buttons & Interactive Controls

#### Primary Gold Call-to-Action (`.btn-primary-gold`)
```css
background: linear-gradient(135deg, #dfb743 0%, #c99c26 50%, #9e7514 100%);
color: #0c0805;
font-family: 'Cinzel', serif;
font-weight: 700;
letter-spacing: 0.08em;
padding: 0.85rem 2.2rem;
border-radius: 8px;
border: 1px solid #ffe599;
box-shadow: 0 4px 20px rgba(212, 175, 55, 0.35);
```
- **Hover**: `transform: translateY(-2px); box-shadow: 0 6px 28px rgba(212, 175, 55, 0.55); filter: brightness(1.08);`
- **Active**: `transform: translateY(0);`

#### Secondary Outline Button (`.btn-secondary-outline`)
```css
background: rgba(26, 19, 14, 0.7);
color: #f5f1eb;
font-family: 'Cinzel', serif;
font-weight: 600;
letter-spacing: 0.05em;
padding: 0.85rem 2rem;
border-radius: 8px;
border: 1px solid rgba(212, 175, 55, 0.35);
```
- **Hover**: `background: rgba(43, 31, 23, 0.9); border-color: #f5e6b8; color: #f5e6b8;`

#### Glass Icon Button
- Dimension: `32px × 32px` or `36px × 36px`
- Background: `#17100b`, Border: `1px solid rgba(212, 175, 55, 0.25)`
- Hover: Border `#d4af37`, Text `#d4af37`

#### Range Slider
- Track height: `5px`, Track background: `#2b1e15`
- Thumb: `16px × 16px`, Circle `#d4af37`, 2px solid `#fff2bf`, glow: `0 0 8px rgba(212, 175, 55, 0.7)`

---

### 5.2 Header & Navigation Bar
- Height: `61px`, Background: `rgba(14, 10, 7, 0.95)`, `backdrop-blur-md`
- Border: Bottom `1px solid var(--border-subtle)`
- Brand Icon: Shield emblem enclosed in gold-gradient frame
- Navigation Links:
  - Resting: `#c5bcb1` with subtle hover `#f5f1eb` on `#1a120c`
  - Active Tab: `#d4af37` text, `#231911` background with `1px solid rgba(212, 175, 55, 0.30)`
  - Direct 3D Action: Solid gold button or highlighted badge

---

### 5.3 3D Simulation Workspace Overlays

```
+-----------------------------------------------------------------------+
|  [Header: CHAKRAFORGE | Overview | 3D Simulator | Experiments | ...]  |
+-----------------------------------------------------------------------+
| [Scenario Drawer]        [3D WebGL Battlefield]      [Agent Inspector]|
| - Presets                - Concentric Rings 1..7     - Tier location  |
| - Sliders (Rings, Comm)  - Chariot standard dhvaja   - Support status |
| - Dynamic Gates Toggle   - Path trails (gold/cyan)   - Decision Tree  |
|                                                                       |
| [Telemetry HUD: Coord Score, Active Phase, Packet Rate, Loss Rate]    |
| [Bottom Playback Bar: Play/Pause, Step, Speed, Camera Angles, Mode]   |
+-----------------------------------------------------------------------+
| [Collapsible Event Timeline: Step-by-step Mahābhārata Chronicle]      |
+-----------------------------------------------------------------------+
```

1. **Floating Playback Bar** (Bottom-center, `z-30`):
   - Transport controls (`Play`, `Pause`, `Step Forward`, `Reset`)
   - Speed selector (`0.5x`, `1x`, `2x`, `4x`)
   - Mode Toggle (`Historical Reconstruction` vs `Counterfactual What-If`)
   - Camera Selector (`Top-Down`, `Orbit`, `Isometric 3D`, `Follow Chariot`)
   - Abhimanyu 1-Click Target Focus

2. **Telemetry HUD** (Top-left floating or docked):
   - Large Coordination Score readout with status color (Green >70%, Amber 40-70%, Red <40%)
   - Step counter, active battle phase tag (`BREACHING`, `ISOLATED`, `CONVERGING`)

3. **Agent Inspector Panel** (Top-right floating):
   - Chariot standard banner icon & agent index
   - Tier location indicator (`Tier 1: Duryodhana Inner Sanctum` ... `Tier 7: Outer Rampart`)
   - Explainable AI reasoning block (`Why did the agent make this decision?`)
   - Perception horizon & active sensory inputs
   - Counterfactual Exit evaluation paths with $P_{\text{success}}\%$ bars

4. **Event Timeline** (Bottom expandable):
   - Chronological log entries color-coded by event category (`STORY_PHASE`, `GATE_ROTATION`, `COMMUNICATION`, `COLLISION`)

---

### 5.4 Experiments Studio & Analytical Dashboard
- **Layout**: 3-Tab selector (`3 Dedicated Empirical Studies`, `Guided 7-Step Protocol`, `Monte Carlo Factorial Matrix`)
- **Visuals**: Recharts integration using custom theme colors:
  - Primary metric line/bar: `#d4af37` (Gold)
  - Secondary metric line/bar: `#22d3ee` (Cyan)
  - Collision metric: `#ef4444` (Crimson)
  - Success probability: `#10b981` (Emerald)
  - Dark grid lines: `rgba(212, 175, 55, 0.12)`
  - Tooltip container: `#16100c`, border `1px solid rgba(212, 175, 55, 0.35)`
- **Data Export**: CSV generation and immediate download button

---

## 6. Layout Rules & Responsive Constraints

1. **Viewport Strategy**:
   - `html, body, #root`: Strict `100vw × 100vh`, `overflow: hidden`.
   - Global layout uses Flexbox column: Fixed Header (`61px`) + Flexible main viewport (`calc(100vh - 61px)`).
2. **Scrollable Workspaces**:
   - For document/research tabs (`OVERVIEW`, `METHODOLOGY`, `SOURCES`, `ABOUT`): Interior container handles vertical scrolling (`overflow-y: auto`) with custom gold-accented scrollbars (`width: 6px`).
   - For `SIMULATOR`: Root container is non-scrollable, Three.js canvas occupies 100% of the canvas area, UI panels float with absolute positioning.
3. **Responsive Breakpoints**:
   - `sm` (`640px`): Single-column cards, mobile hero text
   - `md` (`768px`): Subtitle visibility, 2-column metrics
   - `lg` (`1024px`): Full desktop navigation bar, side-by-side inspector and telemetry panels
   - `xl` (`1280px`): Maximum container width clamp for research text (`max-w-6xl`)

---

## 7. Stitch MCP Design System Definition

For direct programmatic synchronization with Stitch MCP (`upload_design_md` / `create_design_system`):

```json
{
  "displayName": "Chakravyuha Tactical Gold",
  "theme": {
    "colorMode": "DARK",
    "customColor": "#d4af37",
    "colorVariant": "TONAL_SPOT",
    "headlineFont": "CINZEL",
    "bodyFont": "INTER",
    "labelFont": "JETBRAINS_MONO",
    "roundness": "ROUND_EIGHT",
    "overridePrimaryColor": "#d4af37",
    "overrideSecondaryColor": "#c07a4a",
    "overrideTertiaryColor": "#22d3ee",
    "overrideNeutralColor": "#0c0907",
    "spacing": {
      "xs": "4px",
      "sm": "8px",
      "md": "16px",
      "lg": "24px",
      "xl": "32px",
      "xxl": "48px"
    },
    "typography": {
      "display-lg": {
        "fontFamily": "Cinzel",
        "fontSize": "64px",
        "fontWeight": "900",
        "letterSpacing": "0.05em",
        "lineHeight": "1.1"
      },
      "headline-md": {
        "fontFamily": "Cinzel",
        "fontSize": "28px",
        "fontWeight": "700",
        "letterSpacing": "0.04em",
        "lineHeight": "1.25"
      },
      "body-md": {
        "fontFamily": "Inter",
        "fontSize": "14px",
        "fontWeight": "400",
        "letterSpacing": "0px",
        "lineHeight": "1.6"
      },
      "label-sm": {
        "fontFamily": "JetBrains Mono",
        "fontSize": "11px",
        "fontWeight": "500",
        "letterSpacing": "0.04em",
        "lineHeight": "1.3"
      }
    }
  }
}
```

---

## 8. Screen Inventory (Chakravyuha Simulator)

| View / Screen | Purpose & Layout Structure | Key Components |
| :--- | :--- | :--- |
| **1. Story Landing / Overview** | Monograph landing, historical context, core research questions, call to action | Geometric mandala hero, Drona Parva timeline, interactive entry CTA |
| **2. 3D Simulator (Historical)** | Canonical 13th-day simulation, 7 concentric rings, Abhimanyu chariot | 3D WebGL viewport, Playback bar, Telemetry HUD, Agent Inspector |
| **3. 3D Simulator (What-If)** | Computational counterfactual exploration of escape vectors | Cyan theme banners, escape probability vectors, breach seal ablation slider |
| **4. Experiments Studio** | Empirical parameter sweep, batch trials, Monte Carlo studies | Recharts comparative graphs, statistical summary tables, CSV download |
| **5. Formation Guide** | Deep geometric & mathematical breakdown of the 7 tiers | Interactive tier selector, barrier physics, rotation angle diagrams |
| **6. Agent Architecture** | POMDP cognitive loop, sensory horizons, decision trees | Perception cones, strategy decision matrix, communication message queue |
| **7. Scientific Methodology** | Mathematical formulation of Coordination Score, information entropy | LaTeX-style formula blocks, algorithm flowcharts, validation benchmarks |
| **8. Mahabharata Context** | Textual fidelity analysis comparing Ganguli Droṇa Parva translation | Verse citation cards, Sanskrit-English terminology glossary |
| **9. About & Architecture** | Software engineering stack, Vite/Three.js/FastAPI system graph | Technology badge grid, architecture diagram, license & citations |
