# Ship's Time Zone Visualizer - Project Brief

## Project Overview
An interactive web application that visualizes how ship's local time changes as a vessel crosses time zones and the International Date Line, while UTC remains constant. Primary use case: maritime training and demonstrating domain expertise.

## Target Audience
- Maritime students and cadets
- New seafarers learning about timekeeping at sea
- Crew planners and shore-based staff
- LinkedIn professional network (showcase piece)

## Core Functionality

### MVP Features (V1)
1. **Interactive World Map**
   - Nautical chart aesthetic (zoomed-out view, no depth soundings)
   - Longitude lines every 15° marking time zone boundaries
   - Clear labeling: UTC±0 through UTC+12/-12
   - International Date Line prominently displayed (following ~180° with political deviations)

2. **Ship Positioning**
   - Draggable ship icon
   - Real-time display panel showing:
     - Ship's longitude position
     - Ship's local time (24-hour format only)
     - UTC time (24-hour format, constant reference)
     - Current date (accounting for date line)

3. **Route Drawing & Animation**
   - Click to place waypoints on map
   - Visual route line connecting points
   - "Play" button to animate ship along route
   - Speed controls: Slow / Medium / Fast (sped up for demonstration, not realistic vessel speed)
   - Time/date updates in real-time during animation

4. **Date Line Crossing Alerts**
   - Visual notification when ship crosses 180° longitude
   - Clear messaging:
     - "Crossed Date Line Eastbound → Day repeated (e.g., two Wednesdays)"
     - "Crossed Date Line Westbound → Day skipped (Tuesday → Thursday)"
   - Side-by-side comparison: Ship's Date vs UTC Date

### Out of Scope (V1)
- Mobile responsiveness (desktop-first build)
- User accounts or route saving
- Historical voyage data
- Weather/routing
- Accurate navigation features (charts are illustrative only)

## Technical Requirements

### Recommended Stack
- **Frontend Framework**: React with TypeScript
- **Mapping Library**: Leaflet.js OR Mapbox GL JS (for nautical chart styling)
- **Time/Date Handling**: Luxon or date-fns
- **Styling**: Tailwind CSS or styled-components
- **Build Tool**: Vite
- **Deployment**: Vercel or Netlify (easy LinkedIn sharing)

### Key Technical Considerations
- Time zone calculations based on longitude (±15° = ±1 hour from UTC)
- Date line logic: 
  - Westbound crossing (UTC-12 → UTC+12): add 1 day
  - Eastbound crossing (UTC+12 → UTC-12): subtract 1 day
- Smooth animation along plotted routes
- Clear visual feedback for all interactions

## Design Guidelines

### Visual Style
- **Nautical chart aesthetic**: blues/teals for water, beige/tan for land
- Vintage navigation chart feel without being overly detailed
- Clean, readable typography
- Clear hierarchy: map is primary, controls secondary

### UI Layout (Desktop)
```
+--------------------------------------------------+
|  🚢 SHIP'S TIME ZONE VISUALIZER                  |
+--------------------------------------------------+
|                                                  |
|                                                  |
|              [WORLD MAP]                         |
|         (nautical chart style)                   |
|         (timezone lines visible)                 |
|         (ship icon draggable)                    |
|                                                  |
|                                                  |
+--------------------------------------------------+
| SHIP POSITION                                    |
| Longitude: 145°30'E                              |
| Ship Time: 14:30 (UTC+10)                        |
| UTC Time: 04:30                                  |
| Date: 15 January 2026                            |
+--------------------------------------------------+
| [Draw Route] [Clear] [Play ▶] [Speed: Medium ▼] |
+--------------------------------------------------+
```

### Color Palette Suggestion
- Ocean: #2C5F7C, #4A90A4
- Land: #D4C5A9, #E8DCC4
- Time zone lines: #666666 (subtle)
- Date line: #FF6B6B (prominent)
- Ship icon: #FFB84D or ship silhouette
- Text: #1A1A1A on light backgrounds

## User Flows

### Flow 1: Free Exploration
1. User lands on page, ship at default position (e.g., Greenwich, 0°)
2. Information panel shows current ship time = UTC
3. User drags ship eastward → local time increments ahead of UTC
4. User drags ship westward → local time decrements behind UTC
5. User drags across date line → date changes with visual alert

### Flow 2: Route Animation
1. User clicks "Draw Route"
2. Clicks map to place waypoints (e.g., Los Angeles → Honolulu → Tokyo)
3. Route line appears connecting points
4. User clicks "Play"
5. Ship animates smoothly along route
6. Time panel updates continuously
7. When crossing date line: notification appears, date adjusts
8. Animation completes, user can replay or clear route

## Success Criteria
- Deployed, shareable link for LinkedIn
- Smooth, intuitive interactions (drag, draw, animate)
- Accurate time/date calculations
- Clear visualization of date line crossing concept
- Professional appearance suitable for portfolio
- Demonstrates both technical skills and maritime domain knowledge

## Development Approach
1. Set up React + TypeScript project with Vite
2. Implement basic map with Leaflet/Mapbox
3. Add time zone overlay (longitude lines + labels)
4. Implement ship dragging with real-time position/time display
5. Add route drawing functionality
6. Implement animation along routes
7. Add date line crossing detection and alerts
8. Polish styling (nautical chart aesthetic)
9. Deploy to Vercel/Netlify

---

## Suggested First Prompt for Claude Code

"I want to build a Ship's Time Zone Visualizer web app. Please read the full project brief in ship-timezone-visualizer-brief.md, then:

1. Set up a React + TypeScript project using Vite
2. Install necessary dependencies (recommend Leaflet.js for mapping, Luxon for time handling, Tailwind for styling)
3. Create a basic project structure with components for:
   - Map container
   - Ship position display panel
   - Route controls
4. Implement a world map with basic time zone lines (every 15° longitude)
5. Add a draggable ship icon that updates position coordinates in real-time

Use a nautical chart aesthetic with blues for ocean and tans for land. Focus on getting the core map interaction working first, then we'll build out the time calculations and animation features.

Start by creating the project scaffold and getting a basic map rendering."

---

**Project Name**: `ship-timezone-visualizer`  
**Target Completion**: MVP deployable in 1-2 coding sessions  
**LinkedIn Impact**: High - unique maritime tech demo
