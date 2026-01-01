import { useEffect, useRef } from 'react'
import L from 'leaflet'

const TIMEZONE_LINE_COLOR = '#666666'
const DATE_LINE_COLOR = '#FF6B6B'

interface MapContainerProps {
  shipLongitude: number
  onPositionChange: (longitude: number) => void
}

function getTimezoneLabel(longitude: number): string {
  if (Math.abs(longitude) === 180) {
    return 'IDL'
  }
  const offset = longitude / 15
  if (offset === 0) {
    return 'UTC'
  }
  return offset > 0 ? `UTC+${offset}` : `UTC${offset}`
}

function createShipIcon(): L.Icon {
  return L.icon({
    iconUrl: '/ship.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    className: 'ship-icon',
  })
}

export default function MapContainer({
  shipLongitude,
  onPositionChange,
}: MapContainerProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const shipMarkerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Initialize the map centered on the International Date Line (180°)
    // Fixed view: GMT (0°) on left, IDL (180°) in middle, GMT (360°/0°) on right
    const map = L.map(containerRef.current, {
      zoomControl: false,      // Hide zoom controls
      scrollWheelZoom: false,  // Disable scroll zoom
      doubleClickZoom: false,  // Disable double-click zoom
      touchZoom: false,        // Disable touch zoom
      boxZoom: false,          // Disable box zoom
      keyboard: false,         // Disable keyboard navigation
      dragging: false,         // Disable map panning
    }).setView([0, 180], 1.5)  // Fixed zoom level showing full longitude range
    mapRef.current = map

    // Add a tile layer with nautical-style coloring
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map)

    // Add time zone lines every 15 degrees longitude
    // Draw for the visible range (centered on 180°, showing 0° to 360°)
    for (let lng = 0; lng <= 360; lng += 15) {
      const baseLng = lng <= 180 ? lng : lng - 360  // Convert to -180 to 180 range for labels
      const isDateLine = lng === 180
      const color = isDateLine ? DATE_LINE_COLOR : TIMEZONE_LINE_COLOR
      const weight = isDateLine ? 3 : 1
      const opacity = isDateLine ? 1 : 0.5

      L.polyline(
        [
          [-90, lng],
          [90, lng],
        ],
        {
          color,
          weight,
          opacity,
          dashArray: isDateLine ? undefined : '5, 5',
        }
      ).addTo(map)

      // Add timezone label at the top of each line
      const label = getTimezoneLabel(baseLng)
      const labelClass = isDateLine ? 'timezone-label date-line-label' : 'timezone-label'

      L.marker([60, lng], {
        icon: L.divIcon({
          className: labelClass,
          html: `<span>${label}</span>`,
          iconSize: [50, 20],
          iconAnchor: [25, 10],
        }),
        interactive: false,
      }).addTo(map)
    }

    // Add draggable ship marker
    const shipIcon = createShipIcon()
    // Convert normalized longitude (-180 to 180) to display longitude (0 to 360)
    const displayLng = shipLongitude < 0 ? shipLongitude + 360 : shipLongitude
    const shipMarker = L.marker([0, displayLng], {
      icon: shipIcon,
      draggable: true,
    }).addTo(map)

    shipMarker.on('drag', () => {
      // Constrain ship to visible map bounds during drag
      const position = shipMarker.getLatLng()
      let lng = position.lng

      // Clamp longitude to 0-360 range (visible area)
      if (lng < 0) lng = 0
      if (lng > 360) lng = 360

      // Keep latitude at 0 (equator)
      if (position.lat !== 0 || position.lng !== lng) {
        shipMarker.setLatLng([0, lng])
      }

      // Convert display longitude (0-360) back to normalized (-180 to 180)
      const normalizedLng = lng > 180 ? lng - 360 : lng
      onPositionChange(normalizedLng)
    })

    shipMarker.on('dragend', () => {
      const position = shipMarker.getLatLng()
      let lng = position.lng

      // Clamp to visible range
      if (lng < 0) lng = 0
      if (lng > 360) lng = 360

      // Convert display longitude (0-360) back to normalized (-180 to 180)
      const normalizedLng = lng > 180 ? lng - 360 : lng
      onPositionChange(normalizedLng)
    })

    shipMarkerRef.current = shipMarker

    // Cleanup on unmount
    return () => {
      map.remove()
      mapRef.current = null
      shipMarkerRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update ship position when prop changes
  useEffect(() => {
    if (shipMarkerRef.current) {
      // Convert normalized longitude (-180 to 180) to display longitude (0 to 360)
      const displayLng = shipLongitude < 0 ? shipLongitude + 360 : shipLongitude
      shipMarkerRef.current.setLatLng([0, displayLng])
    }
  }, [shipLongitude])

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[500px]"
      data-testid="map-container"
    />
  )
}
