import { DateTime } from 'luxon'

/**
 * Normalize longitude to the range -180 to 180.
 * Handles cases where longitude exceeds these bounds (e.g., from map wrapping).
 */
export function normalizeLongitude(longitude: number): number {
  // Handle exact multiples of 360
  let normalized = longitude % 360

  // Wrap to -180 to 180 range
  if (normalized > 180) {
    normalized = normalized - 360
  } else if (normalized < -180) {
    normalized = normalized + 360
  }

  // Handle -0 edge case
  return normalized === 0 ? 0 : normalized
}

/**
 * Calculate timezone offset in hours based on longitude.
 * Each 15° of longitude = 1 hour offset from UTC.
 * Normalizes longitude first and clamps result to -12 to +12.
 */
export function calculateTimezoneOffset(longitude: number): number {
  const normalized = normalizeLongitude(longitude)
  const offset = Math.round(normalized / 15)
  // Clamp to valid timezone range
  return Math.max(-12, Math.min(12, offset))
}

/**
 * Calculate ship's local time based on UTC time and longitude.
 */
export function calculateShipTime(utc: DateTime, longitude: number): DateTime {
  const offsetHours = calculateTimezoneOffset(longitude)
  return utc.plus({ hours: offsetHours })
}

/**
 * Format longitude as degrees and minutes with E/W suffix.
 * Example: 45.5 -> "45°30'E"
 * Normalizes longitude to -180 to 180 range first.
 */
export function formatLongitude(longitude: number): string {
  const normalized = normalizeLongitude(longitude)
  const absLng = Math.abs(normalized)
  const degrees = Math.floor(absLng)
  const minutes = Math.round((absLng - degrees) * 60)
  const direction = normalized >= 0 ? 'E' : 'W'
  return `${degrees}°${minutes.toString().padStart(2, '0')}'${direction}`
}

/**
 * Format DateTime as 24-hour time string.
 * Example: "14:30"
 */
export function formatTime(dt: DateTime): string {
  return dt.toFormat('HH:mm')
}

/**
 * Format DateTime as date string.
 * Example: "15 January 2026"
 */
export function formatDate(dt: DateTime): string {
  return dt.toFormat('d MMMM yyyy')
}
