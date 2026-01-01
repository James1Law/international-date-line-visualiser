# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ship's Time Zone Visualizer - an interactive web application that visualizes how ship's local time changes as a vessel crosses time zones and the International Date Line, while UTC remains constant. Built for maritime training and demonstrating domain expertise.

## Current Status

**Implemented Features:**
- Fixed map view showing UTC (0°) on left, IDL (180°) in center, UTC (360°) on right
- Timezone lines every 15° with labels (UTC-12 through UTC+12)
- International Date Line highlighted in red with "IDL" label
- Draggable ship marker constrained to visible map area
- Real-time display of ship's longitude, local time, and UTC time
- Date line crossing alerts (shows +1 DAY or -1 DAY notification)
- Map zoom/pan disabled for focused user experience

**Removed/Hidden Features:**
- Route drawing and animation (commented out - was overcomplicating the UX)

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Mapping**: Leaflet.js
- **Time/Date**: Luxon
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest with React Testing Library

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build (runs tsc then vite build)
npm run preview      # Preview production build
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage
```

## Project Structure

```
src/
├── components/
│   ├── MapContainer.tsx       # Leaflet map with timezone lines and ship marker
│   ├── ShipPositionPanel.tsx  # Displays longitude, ship time, UTC time
│   ├── DateLineAlert.tsx      # Shows notification when crossing IDL
│   └── RouteControls.tsx      # (Currently unused - route feature removed)
├── hooks/
│   ├── useCurrentTime.ts      # Real-time UTC clock
│   ├── useRoute.ts            # (Unused - route state management)
│   └── useRouteAnimation.ts   # (Unused - ship animation along route)
├── utils/
│   ├── timeCalculations.ts    # Longitude normalization, timezone offset, formatting
│   └── dateLineCrossing.ts    # Detects IDL crossings, determines direction
├── test/
│   └── setup.ts               # Vitest setup
├── App.tsx                    # Main app layout
├── App.test.tsx               # App tests
├── main.tsx                   # Entry point
└── index.css                  # Global styles + Tailwind
```

## Key Domain Logic

### Time Zone Calculation
- Each 15° longitude = ±1 hour from UTC
- Ship's local time = UTC + (longitude / 15) hours
- Timezone offset clamped to ±12 hours

### Longitude Normalization
- All longitudes normalized to -180° to +180° range
- Display uses 0° to 360° range (centered on 180°/IDL)

### Date Line Crossing
- Eastbound crossing (from ~180° to ~-180°): subtract 1 day (repeat a day)
- Westbound crossing (from ~-180° to ~180°): add 1 day (skip a day)
- Detection based on large longitude change (>180°)

### Map Configuration
- Fixed view centered on International Date Line (180°)
- Zoom level 1.5 (shows full longitude range)
- All zoom/pan interactions disabled
- Ship constrained to equator (lat=0) and visible longitude range

## Design Guidelines

- Nautical chart aesthetic: blues/teals (#2C5F7C, #4A90A4) for water, beige/tan (#D4C5A9, #E8DCC4) for land
- Date line color: #FF6B6B (prominent red)
- Timezone lines: #666666 (gray, dashed)
- Route line: #FF9500 (orange, if re-enabled)
- Ship icon: Custom SVG at /ship.svg
- 24-hour time format only
- Desktop-first (mobile out of scope for V1)

## Testing

- 112 tests across 9 test files
- TDD approach used throughout development
- All components have corresponding `.test.tsx` files
- Leaflet is mocked in component tests
