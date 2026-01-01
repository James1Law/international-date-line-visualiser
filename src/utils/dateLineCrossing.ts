export interface DateLineCrossing {
  direction: 'east' | 'west'
  message: string
}

/**
 * Detects if a ship has crossed the International Date Line between two longitudes.
 * Returns crossing info if crossed, null otherwise.
 *
 * Crossing east (from ~180 to ~-180): subtract one day
 * Crossing west (from ~-180 to ~180): add one day
 */
export function detectDateLineCrossing(
  prevLongitude: number,
  currentLongitude: number
): DateLineCrossing | null {
  // The date line is at ±180°
  // A crossing occurs when the longitude jumps from near +180 to near -180 (or vice versa)
  // This is indicated by a large change in longitude (> 180 degrees)

  const diff = currentLongitude - prevLongitude

  // If the absolute difference is greater than 180, we've crossed the date line
  // (accounting for the wrap-around)
  if (Math.abs(diff) > 180) {
    // Crossing eastward: going from positive (e.g., 170) to negative (e.g., -170)
    // The diff would be negative and large (e.g., -340)
    // Crossing westward: going from negative (e.g., -170) to positive (e.g., 170)
    // The diff would be positive and large (e.g., 340)

    if (diff < 0) {
      // East crossing (positive to negative longitude)
      return {
        direction: 'east',
        message: 'Crossed the Date Line heading East - subtract one day',
      }
    } else {
      // West crossing (negative to positive longitude)
      return {
        direction: 'west',
        message: 'Crossed the Date Line heading West - add one day',
      }
    }
  }

  return null
}
