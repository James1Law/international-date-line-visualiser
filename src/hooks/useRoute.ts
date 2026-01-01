import { useState, useCallback, useRef } from 'react'

export type Speed = 'slow' | 'medium' | 'fast'

export interface Waypoint {
  lat: number
  lng: number
}

export interface UseRouteReturn {
  waypoints: Waypoint[]
  isDrawingRoute: boolean
  isAnimating: boolean
  speed: Speed
  hasRoute: boolean
  toggleDrawingMode: () => void
  addWaypoint: (waypoint: Waypoint) => void
  clearRoute: () => void
  startAnimation: () => void
  stopAnimation: () => void
  setSpeed: (speed: Speed) => void
}

export function useRoute(): UseRouteReturn {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [isDrawingRoute, setIsDrawingRoute] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [speed, setSpeedState] = useState<Speed>('medium')

  // Use ref to track waypoint count synchronously for startAnimation
  const waypointsRef = useRef<Waypoint[]>([])

  const hasRoute = waypoints.length >= 2

  const toggleDrawingMode = useCallback(() => {
    setIsDrawingRoute((prev) => !prev)
  }, [])

  const addWaypoint = useCallback((waypoint: Waypoint) => {
    // Update ref synchronously before state
    waypointsRef.current = [...waypointsRef.current, waypoint]
    setWaypoints(waypointsRef.current)
  }, [])

  const clearRoute = useCallback(() => {
    waypointsRef.current = []
    setWaypoints([])
    setIsAnimating(false)
    setIsDrawingRoute(false)
  }, [])

  const startAnimation = useCallback(() => {
    if (waypointsRef.current.length >= 2) {
      setIsAnimating(true)
      setIsDrawingRoute(false)
    }
  }, [])

  const stopAnimation = useCallback(() => {
    setIsAnimating(false)
  }, [])

  const setSpeed = useCallback((newSpeed: Speed) => {
    setSpeedState(newSpeed)
  }, [])

  return {
    waypoints,
    isDrawingRoute,
    isAnimating,
    speed,
    hasRoute,
    toggleDrawingMode,
    addWaypoint,
    clearRoute,
    startAnimation,
    stopAnimation,
    setSpeed,
  }
}
