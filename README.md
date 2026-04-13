# Workshop Planner

A mobile-first React application for discovering, filtering, and booking student workshops — built as a single-file component with custom CSS, localStorage persistence, and a guided multi-step booking flow.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Visual Showcase](#visual-showcase)
- [Design & UX Approach](#design--ux-approach)
- [Technical Implementation](#technical-implementation)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
- [Trade-offs & Decisions](#trade-offs--decisions)
- [Challenges Faced](#challenges-faced)
- [Future Improvements](#future-improvements)
- [Conclusion](#conclusion)

---

## Overview

Workshop Planner is a student-focused workshop management interface built entirely in React. It simulates a real-world booking system where a student can browse available workshops, filter by status, mode, or difficulty level, walk through a guided booking wizard, and have their progress automatically saved — so a page refresh never means starting over.

The project prioritises clean UX, readable code, and practical engineering decisions over complexity. There are no third-party UI libraries, no routing packages, and no backend — just React hooks, vanilla CSS, and the browser's built-in `localStorage` API.

---

## Key Features

### Core Functionality
- **Dashboard** — At-a-glance stats (Booked, Pending, Total) with quick-book topic cards and a "My Workshops" summary
- **Workshop Listing** — Full list of workshops with instructor details, seat count, and inline badges
- **Workshop Detail View** — Dedicated detail page with metadata grid and a contextual "Book This Workshop" CTA (hidden for already-booked items)
- **Booking Wizard** — A four-step guided flow: Topic → Date → Details → Review & Confirm
- **Profile Page** — User identity card with a navigable settings menu

### Advanced Features

#### 1. Save Draft (LocalStorage Persistence)
The booking wizard automatically persists form state to `localStorage` under the key `"bookingDraft"` after every meaningful change. On remount, the saved draft is restored — including advancing past Step 1 if a topic was already selected. The draft is cleared immediately on confirmed booking.

Edge cases handled:
- `JSON.parse` wrapped in `try/catch` — malformed data silently falls back to defaults
- Type guard rejects non-object values (arrays, `null`, primitives) that could sneak in
- `localStorage` writes wrapped in `try/catch` — fails gracefully in private browsing or when quota is exceeded
- Blank forms are not persisted — avoids polluting storage with empty state

#### 2. Config-Driven Filtering System
Filters are declared as a data structure rather than embedded in logic:

```js
const FILTERS = [
  { label: "All" },
  { label: "Booked",       field: "status", value: "Booked"       },
  { label: "Pending",      field: "status", value: "Pending"       },
  { label: "Online",       field: "mode",   value: "Online"        },
  { label: "Offline",      field: "mode",   value: "Offline"       },
  { label: "Beginner",     field: "level",  value: "Beginner"      },
  { label: "Intermediate", field: "level",  value: "Intermediate"  },
];
```

A single `applyFilter(list, label)` function handles all cases. Adding a new filter — say, `"Advanced"` by level — requires one line in the config array. No conditional chains, no `||` hacks, no logic changes.

#### 3. UX Enhancements
- **Progress rail** — A 4-segment animated bar tracks wizard progress (idle → active → done)
- **Draft saved indicator** — A green `height: 0 → 32px` animated strip appears briefly below the header when a draft is written, disappears after 1.8 s
- **Result count** — Active non-"All" filter chips display a live count badge (e.g., `Booked ②`); a text line below the filter bar confirms results (`"2 results for 'Beginner'"`)
- **Empty state** — A friendly icon and message renders when a filter returns zero results
- **Sticky bottom navigation** — Fixed 4-tab nav with `safe-area-inset-bottom` support for notched devices
- **Screen transitions** — Lightweight `fadeUp` CSS animation on every screen mount (`opacity + translateY`, 220 ms) keeps the app feeling fluid without a motion library

---

## Visual Showcase

The screenshots below illustrate the improved mobile-first UI across key screens — from the dashboard and workshop listing through to the multi-step booking flow. All views are optimised for a 375–430 px viewport.

### Dashboard & Workshop Listing

| Dashboard | Workshop List | Workshop Detail |
|:---------:|:-------------:|:---------------:|
| ![Dashboard](./screenshots/dashboard.png) | ![Workshop List](./screenshots/workshop-list.png) | ![Workshop Detail](./screenshots/workshop-detail.png) |

### Booking Wizard

| Step 1 — Topic | Step 2 — Date | Step 3 — Details | Step 4 — Review |
|:--------------:|:-------------:|:----------------:|:---------------:|
| ![Select Topic](./screenshots/wizard-step1.png) | ![Choose Date](./screenshots/wizard-step2.png) | ![Enter Details](./screenshots/wizard-step3.png) | ![Review & Confirm](./screenshots/wizard-step4.png) |

### Additional Screens

| Booking Confirmed | Profile |
|:-----------------:|:-------:|
| ![Booking Confirmed](./screenshots/booking-confirmed.png) | ![Profile](./screenshots/profile.png) |

> **Note:** Place your screenshots in a `/screenshots` folder at the project root and name them as shown above. All images should be taken on a 375 px wide viewport (iPhone SE / standard mobile emulation in DevTools).

---

## Design & UX Approach

### Mobile-First Layout
Every layout decision starts at 320 px and expands outward. The app shell is capped at `430px` — the width of a large phone — and centred with a subtle drop shadow so it presents cleanly on desktop too. All tap targets meet the 44 px minimum height requirement. The bottom navigation uses `env(safe-area-inset-bottom)` so it doesn't overlap home indicators on iOS.

### Progressive Disclosure
The booking flow is deliberately broken into four small steps rather than one long form. Each step asks for only what it needs: pick a topic, pick a date, fill in contact details, then review. Validation fires per-step — not all at once — so users see errors in context rather than scrolling through a list of problems at the bottom. The "Back" button at Step 0 exits the wizard entirely, which mirrors how users actually think about cancellation.

### Visual Hierarchy
The design uses two typefaces: **Syne** (geometric, high-weight) for headings and identity, and **DM Sans** (humanist, variable-weight) for body and UI text. A warm off-white (`#F5F3EE`) paper tone and a near-black ink (`#0D0F12`) provide strong contrast. The single accent colour (`#E85D2F`) is reserved exclusively for interactive highlights — active states, progress rail, confirm buttons — so it always reads as "do something here."

### Accessibility Considerations
- Semantic HTML elements: `<nav>`, `<button>`, `<label>`, `<input>` throughout
- Form inputs use explicit `<label>` associations
- Disabled date cards carry the `disabled` attribute (not just visual opacity)
- Interactive elements have `:focus` states with visible border colour change
- Colour contrast between body text and backgrounds exceeds WCAG AA for normal text
- All emoji used decoratively; meaningful status information is always available as text (badge labels, not just colour)

---

## Technical Implementation

### React Hooks

| Hook | Where used | Purpose |
|---|---|---|
| `useState` | All pages | Local UI state — current filter, wizard step, form fields, error map, done flag |
| `useState` (lazy init) | `BookingWizard` | Reads `localStorage` exactly once on mount via `() =>` initialiser |
| `useEffect` | `BookingWizard` | Autosaves form to `localStorage` on change; manages toast timer cleanup |

No `useContext`, `useReducer`, or external state library is used. Each component owns its own state; data flows down via props. For a project of this scope, this is the right call — adding a context layer would introduce indirection without reducing prop depth.

### State Management Approach
The app uses a single `route` state object at the `App` level (`{ page, workshopId?, topicId? }`) to simulate routing. Each page component receives a `nav` callback and calls it to navigate. This is intentionally minimal — it keeps the mental model simple and avoids a dependency on React Router for what is effectively a 5-page app.

Form state in the wizard is a flat object updated via a single `upd(key, value)` helper. Errors are a separate object keyed by field name, validated and set per-step on "Next." This keeps the validation logic colocated with the step that owns it.

### LocalStorage Usage

```
┌─────────────────────────────────────────────────────────┐
│ User types in Step 3 (details)                          │
│   → useEffect fires (form changed)                      │
│   → hasData check passes                               │
│   → saveDraft(form) writes JSON to localStorage         │
│   → draftSaved = true → green toast appears             │
│   → setTimeout 1800 ms → draftSaved = false → fades     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ User reloads page / navigates back to wizard            │
│   → useState lazy init calls loadDraft()                │
│   → JSON.parse inside try/catch                         │
│   → Type guard validates shape                          │
│   → Form state restored; step advances if topic exists  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ User clicks "Confirm Booking"                           │
│   → clearDraft() removes key from localStorage          │
│   → setDone(true) → success screen renders              │
└─────────────────────────────────────────────────────────┘
```

### Filtering Architecture

The old approach used `w.status === filter || w.mode === filter`. This worked for two fields but would silently fail for a third (level), and could produce false positives if two fields ever shared a value. The config-driven replacement separates *what to filter* from *how to filter*:

```
FILTERS (config) ──► applyFilter(list, label) ──► filtered list
```

`applyFilter` is a pure function with no side effects. It can be unit-tested independently of any component. The component itself only stores the active label string in state — it has no knowledge of fields or values.

---

## Project Structure

The entire application lives in a single file, `WorkshopPlanner.jsx`, organised into clearly delimited sections:

```
WorkshopPlanner.jsx
│
├── DATA
│   ├── workshops[]        — Mock workshop records (id, title, mode, level, status…)
│   ├── topics[]           — Topic definitions for the wizard step 1 grid
│   └── availableDates[]   — Date options with slot counts and disabled flags
│
├── STYLES
│   └── styles (template literal)
│       — CSS custom properties, reset, layout, component styles
│       — All styles scoped visually by class name convention
│
├── FILTERING
│   ├── FILTERS[]          — Config array: { label, field, value }
│   └── applyFilter()      — Pure filter function
│
├── DRAFT PERSISTENCE
│   ├── DRAFT_KEY          — localStorage key constant
│   ├── loadDraft()        — Safe read with JSON.parse + type guard
│   ├── saveDraft()        — Safe write, silent on quota error
│   └── clearDraft()       — Safe remove
│
├── COMPONENTS
│   ├── Badge              — Colour-coded status/mode/level chip
│   ├── Header             — Sticky top bar with optional back button
│   └── BottomNav          — Fixed 4-tab navigation
│
└── PAGES
    ├── Dashboard          — Stats hero + quick-book grid + my workshops list
    ├── WorkshopList       — Config-driven filter bar + workshop cards
    ├── WorkshopDetail     — Full detail view + conditional book CTA
    ├── BookingWizard      — 4-step wizard with draft persistence
    ├── Profile            — Avatar card + menu list
    └── App                — Route state owner, renders active page
```

---

## How to Run

This project was scaffolded with [Vite](https://vitejs.dev/).

**Prerequisites:** Node.js 18+ and npm 9+

```bash
# 1. Clone or download the repository
git clone https://github.com/ravikumargupta833-dev/workshop-planner.git
cd workshop-planner

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The app is optimised for a 375–430 px viewport; use browser DevTools device emulation for the intended experience.

**Build for production:**
```bash
npm run build
npm run preview   # verify the build locally before deploying
```

The `/dist` output is a static bundle — deployable to Vercel, Netlify, or GitHub Pages with no configuration.

---

## Trade-offs & Decisions

### No External UI Library
Libraries like Material UI or Chakra solve a real problem — design consistency at scale. For a focused single-screen app like this, they introduce several costs that outweigh the benefits: bundle size overhead, a learning curve for evaluators reading the code, and a tendency to mask understanding of the underlying CSS model. Writing the styling from scratch meant I had to make deliberate decisions about every spacing value, colour, and interactive state — and those decisions are all visible and auditable in the `styles` block.

### Single-File Architecture
This was a deliberate choice for a submission context, not a default. A single file is easier to share, review, and run without a build step (when pasted into a sandbox). The internal section separators (`// ─── DATA ───`, `// ─── PAGES ───`) provide the same navigability as a folder structure, and keeping everything in one file prevents the overhead of cross-file imports from obscuring the app's overall shape. In a production codebase, the same components would be extracted to their own files with no logic changes.

### No Routing Library
React Router would be the natural choice in a larger app. Here, a single `{ page, ...params }` state object at the root handles all navigation needs with zero abstraction overhead. It also keeps the bundle lean and the data flow trivially understandable.

### Flat Form State
The wizard form is a single flat object rather than per-step state slices. This makes the review step (Step 4) trivial — every field is already in one place — and means the draft serialisation is a single `JSON.stringify(form)` call rather than merging multiple state objects.

---

## Challenges Faced

### Reliable State Persistence
The naive `localStorage.setItem(key, JSON.stringify(value))` approach breaks in at least three real situations: the user is in private/incognito mode with a full storage quota, the stored value was corrupted by a previous bug, or a non-object (like `null` or an array) was written by accident. Handling all three gracefully — without a try/catch tower scattered across the component — meant extracting `loadDraft`, `saveDraft`, and `clearDraft` as small, independently safe helpers. Each one owns its own error boundary. The component code reads clean; the defensive logic lives where it belongs.

### Mapping a UX Flow to React State
The wizard's "restore draft and advance past completed steps" behaviour needed careful thought. A naive `useState(0)` for the step would always reset to Step 0 on mount, making the draft restoration feel broken even when the form data was correctly restored. The fix was using a lazy `useState` initialiser that reads the draft and computes the correct starting step at mount time — once, synchronously, before the first render. This meant no flash of the wrong step and no `useEffect` side-effect race.

### CSS Without Utility Classes
Without Tailwind or a component library, it is easy to end up with hundreds of one-off inline styles that are impossible to maintain. The constraint I set for myself was: if a style appears more than twice, it gets a class. This kept the `styles` block organised and predictable, and meant that changes to, say, the border radius or accent colour could be made in one place via CSS custom properties.

---

## Future Improvements

- **Real backend integration** — Replace mock data with a REST or GraphQL API; the component interfaces are already shaped for it (workshop IDs, fetch-on-mount pattern)
- **Authentication** — Add a login screen and user session; the Profile page already has the visual scaffold
- **Optimistic booking updates** — Update the dashboard stats immediately on confirm rather than waiting for a server round-trip
- **Unit tests** — `applyFilter` and the draft helpers are pure functions and straightforward to cover with Vitest; the wizard validation logic is also a good target
- **Keyboard navigation** — The topic grid and date grid are currently button-based but would benefit from arrow-key navigation for accessibility
- **Animations library** — The current `fadeUp` CSS animation is sufficient, but a lightweight library like Motion (formerly Framer Motion's core) would allow more expressive transitions between wizard steps
- **Service Worker / PWA** — Caching the app shell and workshop data offline would make this genuinely usable in low-connectivity campus environments, which is exactly the intended use case

---

## Conclusion

Workshop Planner is a small app with real engineering attention put into it. The filtering system is extensible by design, not by accident. The draft persistence handles the failure modes that most first implementations miss. The UX decisions — progressive disclosure, step-level validation, immediate feedback — are grounded in how people actually use multi-step forms on mobile.

The goal was to demonstrate that good frontend engineering is not about which libraries you pick, but about the clarity of your state model, the predictability of your data flow, and the care you take with the user's time. Hopefully, this codebase reflects that.
