import { renderHook, act } from '@testing-library/react'
import { useRouteAnimation } from './useRouteAnimation'
import type { Waypoint } from './useRoute'

describe('useRouteAnimation', () => {
  const waypoints: Waypoint[] = [
    { lat: 0, lng: -170 },
    { lat: 0, lng: 170 },
  ]

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial ship longitude of 0', () => {
    const { result } = renderHook(() =>
      useRouteAnimation({
        waypoints: [],
        isAnimating: false,
        speed: 'medium',
        onAnimationComplete: vi.fn(),
      })
    )
    expect(result.current.shipLongitude).toBe(0)
  })

  it('does not animate when isAnimating is false', () => {
    const { result } = renderHook(() =>
      useRouteAnimation({
        waypoints,
        isAnimating: false,
        speed: 'medium',
        onAnimationComplete: vi.fn(),
      })
    )

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.shipLongitude).toBe(0)
  })

  it('starts animation from first waypoint when isAnimating becomes true', () => {
    const { result } = renderHook(() =>
      useRouteAnimation({
        waypoints,
        isAnimating: true,
        speed: 'medium',
        onAnimationComplete: vi.fn(),
      })
    )

    // Should start at first waypoint
    expect(result.current.shipLongitude).toBe(-170)
  })

  it('calls onAnimationComplete when animation finishes', () => {
    const onComplete = vi.fn()
    renderHook(() =>
      useRouteAnimation({
        waypoints,
        isAnimating: true,
        speed: 'fast',
        onAnimationComplete: onComplete,
      })
    )

    act(() => {
      // Advance enough time to complete the animation
      vi.advanceTimersByTime(30000)
    })

    expect(onComplete).toHaveBeenCalled()
  })

  it('animates faster with fast speed', () => {
    const onCompleteFast = vi.fn()
    const onCompleteSlow = vi.fn()

    const { result: fastResult } = renderHook(() =>
      useRouteAnimation({
        waypoints,
        isAnimating: true,
        speed: 'fast',
        onAnimationComplete: onCompleteFast,
      })
    )

    act(() => {
      vi.advanceTimersByTime(500)
    })

    const fastProgress = fastResult.current.shipLongitude

    const { result: slowResult } = renderHook(() =>
      useRouteAnimation({
        waypoints,
        isAnimating: true,
        speed: 'slow',
        onAnimationComplete: onCompleteSlow,
      })
    )

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Fast should have moved further than slow in same time
    // Since we're going from -170 to 170, higher value = more progress
    expect(Math.abs(fastProgress - (-170))).toBeGreaterThan(Math.abs(slowResult.current.shipLongitude - (-170)))
  })

  it('allows setting ship longitude externally', () => {
    const { result } = renderHook(() =>
      useRouteAnimation({
        waypoints: [],
        isAnimating: false,
        speed: 'medium',
        onAnimationComplete: vi.fn(),
      })
    )

    act(() => {
      result.current.setShipLongitude(45)
    })

    expect(result.current.shipLongitude).toBe(45)
  })
})
