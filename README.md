# Ship's Time Zone Visualizer

An interactive web application that visualizes how a ship's local time changes as it crosses time zones and the International Date Line, while UTC remains constant.

Built for maritime training and demonstrating domain expertise in timekeeping at sea.

## Features

- **Interactive World Map** - Nautical chart aesthetic with political timezone boundaries
- **Draggable Ship** - Move the ship across the map to see time changes in real-time
- **Real-Time Display** - Shows ship's longitude, local time (with IANA timezone), and UTC time
- **Fractional Timezone Support** - Handles UTC+5:30 (India), UTC+5:45 (Nepal), etc.
- **Date Line Crossing Alerts** - Visual notifications when crossing the International Date Line
  - Eastbound: Day repeated (-1 day)
  - Westbound: Day skipped (+1 day)
- **Zoomable Map** - Zoom in for detail, with minimum zoom locked to prevent world wrap
- **IDL-Centered View** - Map centered on the International Date Line (180°) for maritime training

## Tech Stack

- **React 19** with TypeScript
- **Vite** - Build tool
- **Leaflet.js** - Interactive mapping
- **Luxon** - Time/date calculations
- **Tailwind CSS** - Styling
- **Vitest** - Testing framework

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/James1Law/international-date-line-visualiser.git
cd international-date-line-visualiser

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |

## How It Works

### Time Zone Calculation
- Uses [@photostructure/tz-lookup](https://github.com/photostructure/tz-lookup) to get IANA timezone from coordinates
- Luxon handles timezone offset calculation (including DST awareness)
- Supports fractional offsets like UTC+5:30 (India) and UTC+5:45 (Nepal)
- Falls back to longitude-based calculation if lookup fails

### Date Line Logic
- **Eastbound crossing** (from ~180° to ~-180°): Subtract 1 day (repeat a day)
- **Westbound crossing** (from ~-180° to ~180°): Add 1 day (skip a day)

## Target Audience

- Maritime students and cadets
- New seafarers learning about timekeeping at sea
- Crew planners and shore-based staff
- Anyone curious about how time works at sea

## License

MIT

---

*Built with nautical precision*
