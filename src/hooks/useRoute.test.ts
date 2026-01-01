import { renderHook, act } from '@testing-library/react'
import { useRoute } from './useRoute'

describe('useRoute', () => {
  describe('initial state', () => {
    it('starts with empty waypoints', () => {
      const { result } = renderHook(() => useRoute())
      expect(result.current.waypoints).toEqual([])
    })

    it('starts not in drawing mode', () => {
      const { result } = renderHook(() => useRoute())
      expect(result.current.isDrawingRoute).toBe(false)
    })

    it('starts not animating', () => {
      const { result } = renderHook(() => useRoute())
      expect(result.current.isAnimating).toBe(false)
    })

    it('starts with medium speed', () => {
      const { result } = renderHook(() => useRoute())
      expect(result.current.speed).toBe('medium')
    })
  })

  describe('drawing mode', () => {
    it('toggles drawing mode on', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.toggleDrawingMode()
      })
      expect(result.current.isDrawingRoute).toBe(true)
    })

    it('toggles drawing mode off', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.toggleDrawingMode()
        result.current.toggleDrawingMode()
      })
      expect(result.current.isDrawingRoute).toBe(false)
    })
  })

  describe('waypoints', () => {
    it('adds a waypoint', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.addWaypoint({ lat: 10, lng: 20 })
      })
      expect(result.current.waypoints).toEqual([{ lat: 10, lng: 20 }])
    })

    it('adds multiple waypoints in order', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.addWaypoint({ lat: 10, lng: 20 })
        result.current.addWaypoint({ lat: 30, lng: 40 })
        result.current.addWaypoint({ lat: 50, lng: 60 })
      })
      expect(result.current.waypoints).toEqual([
        { lat: 10, lng: 20 },
        { lat: 30, lng: 40 },
        { lat: 50, lng: 60 },
      ])
    })

    it('clears all waypoints', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.addWaypoint({ lat: 10, lng: 20 })
        result.current.addWaypoint({ lat: 30, lng: 40 })
        result.current.clearRoute()
      })
      expect(result.current.waypoints).toEqual([])
    })

    it('clearing route also stops animation', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.addWaypoint({ lat: 10, lng: 20 })
        result.current.addWaypoint({ lat: 30, lng: 40 })
        result.current.startAnimation()
        result.current.clearRoute()
      })
      expect(result.current.isAnimating).toBe(false)
    })

    it('clearing route also exits drawing mode', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.toggleDrawingMode()
        result.current.clearRoute()
      })
      expect(result.current.isDrawingRoute).toBe(false)
    })
  })

  describe('animation', () => {
    it('starts animation when there are at least 2 waypoints', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.addWaypoint({ lat: 10, lng: 20 })
        result.current.addWaypoint({ lat: 30, lng: 40 })
        result.current.startAnimation()
      })
      expect(result.current.isAnimating).toBe(true)
    })

    it('does not start animation with less than 2 waypoints', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.addWaypoint({ lat: 10, lng: 20 })
        result.current.startAnimation()
      })
      expect(result.current.isAnimating).toBe(false)
    })

    it('stops animation', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.addWaypoint({ lat: 10, lng: 20 })
        result.current.addWaypoint({ lat: 30, lng: 40 })
        result.current.startAnimation()
        result.current.stopAnimation()
      })
      expect(result.current.isAnimating).toBe(false)
    })

    it('starting animation exits drawing mode', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.toggleDrawingMode()
        result.current.addWaypoint({ lat: 10, lng: 20 })
        result.current.addWaypoint({ lat: 30, lng: 40 })
        result.current.startAnimation()
      })
      expect(result.current.isDrawingRoute).toBe(false)
    })
  })

  describe('speed', () => {
    it('changes speed to slow', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.setSpeed('slow')
      })
      expect(result.current.speed).toBe('slow')
    })

    it('changes speed to fast', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.setSpeed('fast')
      })
      expect(result.current.speed).toBe('fast')
    })
  })

  describe('route info', () => {
    it('reports hasRoute as false with no waypoints', () => {
      const { result } = renderHook(() => useRoute())
      expect(result.current.hasRoute).toBe(false)
    })

    it('reports hasRoute as false with 1 waypoint', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.addWaypoint({ lat: 10, lng: 20 })
      })
      expect(result.current.hasRoute).toBe(false)
    })

    it('reports hasRoute as true with 2+ waypoints', () => {
      const { result } = renderHook(() => useRoute())
      act(() => {
        result.current.addWaypoint({ lat: 10, lng: 20 })
        result.current.addWaypoint({ lat: 30, lng: 40 })
      })
      expect(result.current.hasRoute).toBe(true)
    })
  })
})
