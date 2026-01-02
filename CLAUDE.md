# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ship's Time Zone Visualizer - an interactive web application that visualizes how ship's local time changes as a vessel crosses time zones and the International Date Line, while UTC remains constant. Built for maritime training and demonstrating domain expertise.

## Current Status

**Implemented Features:**
- Map view showing UTC (0°) on left, IDL (180°) in center, UTC (360°) on right
- Political timezone boundaries displayed using Natural Earth TopoJSON data
- International Date Line highlighted in red with "IDL" label
- Draggable ship marker (can move latitude and longitude)
- Real-time display of ship's longitude, local time, UTC time, and IANA timezone name
- Support for fractional timezone offsets (e.g., India UTC+5:30, Nepal UTC+5:45)
- Date line crossing alerts (shows +1 DAY or -1 DAY notification)
- Zoom controls enabled (can zoom in for detail, but not zoom out past initial view)
- Pan/scroll enabled when zoomed in

**Removed/Hidden Features:**
- Route drawing and animation (commented out - was overcomplicating the UX)
- Timezone hover tooltips (removed - were distracting when dragging ship)

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Mapping**: Leaflet.js with TopoJSON timezone data
- **Time/Date**: Luxon
- **Timezone Lookup**: @photostructure/tz-lookup (coordinate to IANA timezone)
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
- Uses @photostructure/tz-lookup to get IANA timezone from coordinates
- Luxon handles timezone offset calculation (including DST)
- Supports fractional offsets: UTC+5:30 (India), UTC+5:45 (Nepal), etc.
- Fallback to longitude-based calculation if lookup fails

### Longitude Normalization
- All longitudes normalized to -180° to +180° range
- Display uses 0° to 360° range (centered on 180°/IDL)

### Date Line Crossing
- Eastbound crossing (from ~180° to ~-180°): subtract 1 day (repeat a day)
- Westbound crossing (from ~-180° to ~180°): add 1 day (skip a day)
- Detection based on large longitude change (>180°)

### Map Configuration
- View centered on International Date Line (180°) using `fitBounds([[-60, 0], [70, 360]])`
- Zoom dynamically calculated to fit container without showing duplicate content
- Min zoom locked to initial level (prevents zooming out to see world wrap)
- Max zoom set to 10 (allows zooming in for detail)
- Zoom controls, scroll wheel zoom, double-click zoom, and panning all enabled
- Ship can move freely within visible bounds (lat: -60° to 70°, lng: 0° to 360°)
- Timezone boundaries loaded from /public/timezones.json (Natural Earth data)
- CSS `overflow: hidden` on map container as visual fallback

## Design Guidelines

- Nautical chart aesthetic: blues/teals (#2C5F7C, #4A90A4) for water, beige/tan (#D4C5A9, #E8DCC4) for land
- Date line color: #FF6B6B (prominent red)
- Timezone lines: #666666 (gray, dashed)
- Route line: #FF9500 (orange, if re-enabled)
- Ship icon: Custom SVG at /ship.svg
- 24-hour time format only
- Desktop-first (mobile out of scope for V1)

## Testing

- 119 tests across 9 test files
- TDD approach used throughout development
- All components have corresponding `.test.tsx` files
- Leaflet and fetch are mocked in component tests
