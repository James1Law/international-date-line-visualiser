import { render, screen } from '@testing-library/react'
import MapContainer from './MapContainer'
import L from 'leaflet'

// Mock Leaflet since it requires a real DOM
vi.mock('leaflet', () => {
  const mockMap = {
    setView: vi.fn().mockReturnThis(),
    addLayer: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    getContainer: vi.fn(() => ({ style: {} })),
  }

  const mockTileLayer = {
    addTo: vi.fn().mockReturnThis(),
  }

  const mockPolyline = {
    addTo: vi.fn().mockReturnThis(),
    remove: vi.fn(),
  }

  const mockMarker = {
    addTo: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    setLatLng: vi.fn().mockReturnThis(),
    getLatLng: vi.fn().mockReturnValue({ lat: 0, lng: 0 }),
  }

  const mockDivIcon = {}

  const mockIcon = {}

  return {
    default: {
      map: vi.fn(() => mockMap),
      tileLayer: vi.fn(() => mockTileLayer),
      polyline: vi.fn(() => mockPolyline),
      marker: vi.fn(() => mockMarker),
      divIcon: vi.fn(() => mockDivIcon),
      icon: vi.fn(() => mockIcon),
    },
  }
})

const defaultProps = {
  shipLongitude: 0,
  onPositionChange: vi.fn(),
}

describe('MapContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the map container element', () => {
    render(<MapContainer {...defaultProps} />)
    expect(screen.getByTestId('map-container')).toBeInTheDocument()
  })

  it('initializes a Leaflet map on mount', () => {
    render(<MapContainer {...defaultProps} />)
    expect(L.map).toHaveBeenCalled()
  })

  it('sets map view centered on International Date Line', () => {
    render(<MapContainer {...defaultProps} />)
    const mockMap = (L.map as ReturnType<typeof vi.fn>).mock.results[0]?.value
    // Map should be centered on the IDL (180°)
    expect(mockMap.setView).toHaveBeenCalledWith([0, 180], expect.any(Number))
  })

  it('disables zoom and pan controls', () => {
    render(<MapContainer {...defaultProps} />)
    const mapOptions = (L.map as ReturnType<typeof vi.fn>).mock.calls[0]?.[1]
    expect(mapOptions.zoomControl).toBe(false)
    expect(mapOptions.scrollWheelZoom).toBe(false)
    expect(mapOptions.doubleClickZoom).toBe(false)
    expect(mapOptions.dragging).toBe(false)
  })

  it('adds a tile layer for the base map', () => {
    render(<MapContainer {...defaultProps} />)
    expect(L.tileLayer).toHaveBeenCalled()
  })

  it('renders time zone lines every 15 degrees longitude', () => {
    render(<MapContainer {...defaultProps} />)
    // Should create 25 lines: 0, 15, 30, ..., 345, 360
    const polylineCalls = (L.polyline as ReturnType<typeof vi.fn>).mock.calls
    expect(polylineCalls.length).toBeGreaterThanOrEqual(25)
  })

  it('renders the International Date Line at 180 degrees', () => {
    render(<MapContainer {...defaultProps} />)
    const polylineCalls = (L.polyline as ReturnType<typeof vi.fn>).mock.calls

    // Find the call that creates a line at longitude 180
    const dateLineCalls = polylineCalls.filter((call) => {
      const coords = call[0]
      return coords.some((coord: [number, number]) => coord[1] === 180)
    })

    expect(dateLineCalls.length).toBeGreaterThan(0)
  })

  it('styles the date line differently from other time zone lines', () => {
    render(<MapContainer {...defaultProps} />)
    const polylineCalls = (L.polyline as ReturnType<typeof vi.fn>).mock.calls

    // Find date line call (at 180)
    const dateLineCall = polylineCalls.find((call) => {
      const coords = call[0]
      return coords.some((coord: [number, number]) => coord[1] === 180)
    })

    // Date line should have red color (#FF6B6B)
    expect(dateLineCall?.[1]?.color).toBe('#FF6B6B')
  })

  it('cleans up the map on unmount', () => {
    const { unmount } = render(<MapContainer {...defaultProps} />)
    const mockMap = (L.map as ReturnType<typeof vi.fn>).mock.results[0]?.value
    unmount()
    expect(mockMap.remove).toHaveBeenCalled()
  })

  it('adds timezone labels for each line', () => {
    render(<MapContainer {...defaultProps} />)
    const markerCalls = (L.marker as ReturnType<typeof vi.fn>).mock.calls
    // Should create 25 labels + 1 ship marker = 26
    expect(markerCalls.length).toBeGreaterThanOrEqual(25)
  })

  it('labels the date line as IDL', () => {
    render(<MapContainer {...defaultProps} />)
    const divIconCalls = (L.divIcon as ReturnType<typeof vi.fn>).mock.calls

    // Find the IDL label
    const idlLabel = divIconCalls.find((call) =>
      call[0]?.html?.includes('IDL')
    )

    expect(idlLabel).toBeDefined()
  })

  it('labels the prime meridian as UTC', () => {
    render(<MapContainer {...defaultProps} />)
    const divIconCalls = (L.divIcon as ReturnType<typeof vi.fn>).mock.calls

    // Find the UTC label (should be exactly "UTC" not "UTC+0")
    const utcLabel = divIconCalls.find((call) =>
      call[0]?.html === '<span>UTC</span>'
    )

    expect(utcLabel).toBeDefined()
  })

  describe('Ship marker', () => {
    it('creates a draggable ship marker', () => {
      render(<MapContainer {...defaultProps} />)
      const markerCalls = (L.marker as ReturnType<typeof vi.fn>).mock.calls

      // Find the ship marker (it should have draggable: true)
      const shipMarkerCall = markerCalls.find((call) =>
        call[1]?.draggable === true
      )

      expect(shipMarkerCall).toBeDefined()
    })

    it('positions ship marker at the correct display longitude', () => {
      render(<MapContainer {...defaultProps} shipLongitude={45} />)
      const markerCalls = (L.marker as ReturnType<typeof vi.fn>).mock.calls

      // Find the ship marker
      const shipMarkerCall = markerCalls.find((call) =>
        call[1]?.draggable === true
      )

      // 45° normalized = 45° display (positive values stay the same)
      expect(shipMarkerCall?.[0]).toEqual([0, 45])
    })

    it('converts negative longitude to display longitude', () => {
      render(<MapContainer {...defaultProps} shipLongitude={-90} />)
      const markerCalls = (L.marker as ReturnType<typeof vi.fn>).mock.calls

      // Find the ship marker
      const shipMarkerCall = markerCalls.find((call) =>
        call[1]?.draggable === true
      )

      // -90° normalized = 270° display (adds 360)
      expect(shipMarkerCall?.[0]).toEqual([0, 270])
    })

    it('uses a custom ship icon', () => {
      render(<MapContainer {...defaultProps} />)
      expect(L.icon).toHaveBeenCalled()
    })

    it('registers drag and dragend event handlers', () => {
      render(<MapContainer {...defaultProps} />)

      const mockMarker = (L.marker as ReturnType<typeof vi.fn>).mock.results[0]?.value
      expect(mockMarker.on).toHaveBeenCalledWith('drag', expect.any(Function))
      expect(mockMarker.on).toHaveBeenCalledWith('dragend', expect.any(Function))
    })
  })
})
