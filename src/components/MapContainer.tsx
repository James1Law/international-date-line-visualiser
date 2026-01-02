import { useEffect, useRef } from 'react'
import L from 'leaflet'
import * as topojson from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'

const DATE_LINE_COLOR = '#FF6B6B'
const TIMEZONE_COLORS = ['#2C5F7C', '#4A90A4'] // Alternating nautical blues

interface MapContainerProps {
  shipLatitude: number
  shipLongitude: number
  onPositionChange: (latitude: number, longitude: number) => void
}

interface TimezoneProperties {
  zone: number
  name: string
  utc_format: string
}

function getTimezoneStyle(_feature: GeoJSON.Feature | undefined): L.PathOptions {
  // Use consistent styling for all timezone polygons
  return {
    fillColor: TIMEZONE_COLORS[0],
    fillOpacity: 0.1,
    color: '#666666',
    weight: 1,
    opacity: 0.5,
  }
}

// Transform coordinates from -180..180 to 0..360 range for display
function transformCoordinates(coords: number[]): number[] {
  const [lng, lat] = coords
  return [lng < 0 ? lng + 360 : lng, lat]
}

function transformGeometry(geometry: GeoJSON.Geometry): GeoJSON.Geometry {
  switch (geometry.type) {
    case 'Point':
      return {
        ...geometry,
        coordinates: transformCoordinates(geometry.coordinates as number[]),
      }
    case 'LineString':
    case 'MultiPoint':
      return {
        ...geometry,
        coordinates: (geometry.coordinates as number[][]).map(transformCoordinates),
      }
    case 'Polygon':
    case 'MultiLineString':
      return {
        ...geometry,
        coordinates: (geometry.coordinates as number[][][]).map(ring =>
          ring.map(transformCoordinates)
        ),
      }
    case 'MultiPolygon':
      return {
        ...geometry,
        coordinates: (geometry.coordinates as number[][][][]).map(polygon =>
          polygon.map(ring => ring.map(transformCoordinates))
        ),
      }
    case 'GeometryCollection':
      return {
        ...geometry,
        geometries: geometry.geometries.map(transformGeometry),
      }
    default:
      return geometry
  }
}

function transformGeoJSON(geojson: GeoJSON.FeatureCollection): GeoJSON.FeatureCollection {
  return {
    ...geojson,
    features: geojson.features.map(feature => ({
      ...feature,
      geometry: transformGeometry(feature.geometry),
    })),
  }
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
  shipLatitude,
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
      zoomControl: true,       // Show zoom controls
      scrollWheelZoom: true,   // Enable scroll zoom
      doubleClickZoom: true,   // Enable double-click zoom
      touchZoom: true,         // Enable touch zoom
      boxZoom: false,          // Disable box zoom (can cause issues with bounds)
      keyboard: true,          // Enable keyboard navigation
      dragging: true,          // Enable map panning when zoomed in
    })
    mapRef.current = map

    // Fit bounds to show exactly 0-360° longitude range
    // This auto-calculates the correct zoom for the container size
    map.fitBounds([[-60, 0], [70, 360]], {
      animate: false,
      padding: [0, 0],
    })

    // Set min zoom to current level (can't zoom out further to see duplicates)
    // Allow zooming in up to level 10
    const currentZoom = map.getZoom()
    map.setMinZoom(currentZoom)
    map.setMaxZoom(10)

    // Add a tile layer with nautical-style coloring
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map)

    // Load and display timezone boundaries from TopoJSON
    fetch('/timezones.json')
      .then(response => response.json())
      .then((topoData: Topology<{ ne_10m_time_zones: GeometryCollection<TimezoneProperties> }>) => {
        const geojsonData = topojson.feature(topoData, topoData.objects.ne_10m_time_zones)

        // Transform coordinates from -180..180 to 0..360 for our map view
        const transformedData = transformGeoJSON(geojsonData as GeoJSON.FeatureCollection)

        // Add timezone polygons (no tooltips - they were distracting when dragging ship)
        L.geoJSON(transformedData, {
          style: getTimezoneStyle,
          interactive: false,  // Disable hover/click interactions
        }).addTo(map)
      })
      .catch(err => console.warn('Failed to load timezone data:', err))

    // Add International Date Line overlay (prominent)
    L.polyline(
      [
        [-90, 180],
        [90, 180],
      ],
      {
        color: DATE_LINE_COLOR,
        weight: 3,
        opacity: 1,
      }
    ).addTo(map)

    // Add IDL label
    L.marker([60, 180], {
      icon: L.divIcon({
        className: 'timezone-label date-line-label',
        html: '<span>IDL</span>',
        iconSize: [50, 20],
        iconAnchor: [25, 10],
      }),
      interactive: false,
    }).addTo(map)

    // Add draggable ship marker
    const shipIcon = createShipIcon()
    // Convert normalized longitude (-180 to 180) to display longitude (0 to 360)
    const displayLng = shipLongitude < 0 ? shipLongitude + 360 : shipLongitude
    const shipMarker = L.marker([shipLatitude, displayLng], {
      icon: shipIcon,
      draggable: true,
    }).addTo(map)

    shipMarker.on('drag', () => {
      // Constrain ship to visible map bounds during drag
      const position = shipMarker.getLatLng()
      let lat = position.lat
      let lng = position.lng

      // Clamp longitude to 0-360 range (visible area)
      if (lng < 0) lng = 0
      if (lng > 360) lng = 360

      // Clamp latitude to reasonable bounds
      if (lat < -60) lat = -60
      if (lat > 70) lat = 70

      // Update marker position if constrained
      if (position.lat !== lat || position.lng !== lng) {
        shipMarker.setLatLng([lat, lng])
      }

      // Convert display longitude (0-360) back to normalized (-180 to 180)
      const normalizedLng = lng > 180 ? lng - 360 : lng
      onPositionChange(lat, normalizedLng)
    })

    shipMarker.on('dragend', () => {
      const position = shipMarker.getLatLng()
      let lat = position.lat
      let lng = position.lng

      // Clamp to visible range
      if (lng < 0) lng = 0
      if (lng > 360) lng = 360
      if (lat < -60) lat = -60
      if (lat > 70) lat = 70

      // Convert display longitude (0-360) back to normalized (-180 to 180)
      const normalizedLng = lng > 180 ? lng - 360 : lng
      onPositionChange(lat, normalizedLng)
    })

    shipMarkerRef.current = shipMarker

    // Cleanup on unmount
    return () => {
      map.remove()
      mapRef.current = null
      shipMarkerRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update ship position when props change
  useEffect(() => {
    if (shipMarkerRef.current) {
      // Convert normalized longitude (-180 to 180) to display longitude (0 to 360)
      const displayLng = shipLongitude < 0 ? shipLongitude + 360 : shipLongitude
      shipMarkerRef.current.setLatLng([shipLatitude, displayLng])
    }
  }, [shipLatitude, shipLongitude])

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[500px]"
      data-testid="map-container"
    />
  )
}
