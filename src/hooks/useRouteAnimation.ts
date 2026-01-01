import { useState, useEffect, useRef } from 'react'
import type { Waypoint, Speed } from './useRoute'

interface UseRouteAnimationProps {
  waypoints: Waypoint[]
  isAnimating: boolean
  speed: Speed
  onAnimationComplete: () => void
}

interface UseRouteAnimationReturn {
  shipLongitude: number
  setShipLongitude: (lng: number) => void
}

const SPEED_MULTIPLIERS: Record<Speed, number> = {
  slow: 0.5,
  medium: 1,
  fast: 2,
}

// Duration to traverse one segment (in ms) at medium speed
const BASE_SEGMENT_DURATION = 5000

function interpolate(start: number, end: number, progress: number): number {
  return start + (end - start) * progress
}

export function useRouteAnimation({
  waypoints,
  isAnimating,
  speed,
  onAnimationComplete,
}: UseRouteAnimationProps): UseRouteAnimationReturn {
  const [shipLongitude, setShipLongitude] = useState(0)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const segmentIndexRef = useRef(0)

  // Calculate total animation duration based on speed
  const segmentDuration = BASE_SEGMENT_DURATION / SPEED_MULTIPLIERS[speed]

  useEffect(() => {
    if (!isAnimating || waypoints.length < 2) {
      return
    }

    // Start animation from first waypoint
    segmentIndexRef.current = 0
    startTimeRef.current = Date.now()
    setShipLongitude(waypoints[0].lng)

    const FRAME_INTERVAL = 16 // ~60fps

    const intervalId = setInterval(() => {
      const now = Date.now()
      const elapsed = now - startTimeRef.current
      const segmentProgress = elapsed / segmentDuration

      if (segmentProgress >= 1) {
        // Move to next segment
        segmentIndexRef.current++
        startTimeRef.current = now

        if (segmentIndexRef.current >= waypoints.length - 1) {
          // Animation complete
          setShipLongitude(waypoints[waypoints.length - 1].lng)
          clearInterval(intervalId)
          onAnimationComplete()
          return
        }
      }

      const currentSegment = segmentIndexRef.current
      const clampedProgress = Math.min(segmentProgress, 1)

      const startWp = waypoints[currentSegment]
      const endWp = waypoints[currentSegment + 1]

      const currentLng = interpolate(startWp.lng, endWp.lng, clampedProgress)
      setShipLongitude(currentLng)
    }, FRAME_INTERVAL)

    animationRef.current = intervalId as unknown as number

    return () => {
      clearInterval(intervalId)
      animationRef.current = null
    }
  }, [isAnimating, waypoints, segmentDuration, onAnimationComplete])

  return {
    shipLongitude,
    setShipLongitude,
  }
}
