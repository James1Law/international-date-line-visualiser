import { DateTime } from 'luxon'
import tzlookup from '@photostructure/tz-lookup'

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
 * Get timezone information from coordinates.
 * Returns the IANA timezone name (e.g., "Asia/Kolkata", "America/New_York").
 */
export function getTimezoneFromCoordinates(latitude: number, longitude: number): string {
  const normalizedLng = normalizeLongitude(longitude)
  try {
    return tzlookup(latitude, normalizedLng)
  } catch {
    // Fallback for edge cases - use UTC offset based on longitude
    const offset = Math.round(normalizedLng / 15)
    const clampedOffset = Math.max(-12, Math.min(12, offset))
    if (clampedOffset === 0) return 'UTC'
    return clampedOffset > 0 ? `Etc/GMT-${clampedOffset}` : `Etc/GMT+${Math.abs(clampedOffset)}`
  }
}

/**
 * Get timezone offset in hours (including fractional hours) from coordinates.
 * Uses actual political timezone data for accurate offsets.
 */
export function getTimezoneOffset(latitude: number, longitude: number): number {
  const timezone = getTimezoneFromCoordinates(latitude, longitude)
  const dt = DateTime.now().setZone(timezone)
  // Luxon offset is in minutes, convert to hours
  return dt.offset / 60
}

/**
 * Calculate timezone offset in hours based on longitude.
 * Each 15° of longitude = 1 hour offset from UTC.
 * Normalizes longitude first and clamps result to -12 to +12.
 * @deprecated Use getTimezoneOffset(lat, lng) for political timezone accuracy
 */
export function calculateTimezoneOffset(longitude: number): number {
  const normalized = normalizeLongitude(longitude)
  const offset = Math.round(normalized / 15)
  // Clamp to valid timezone range
  return Math.max(-12, Math.min(12, offset))
}

/**
 * Calculate ship's local time based on UTC time and coordinates.
 * Uses actual political timezone for accurate time calculation.
 */
export function calculateShipTime(utc: DateTime, latitude: number, longitude: number): DateTime {
  const timezone = getTimezoneFromCoordinates(latitude, longitude)
  return utc.setZone(timezone)
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

/**
 * Format timezone offset as UTC string.
 * Handles whole hours and fractional offsets (e.g., UTC+5:30).
 * Example: 5.5 -> "UTC+5:30", -8 -> "UTC-8"
 */
export function formatTimezoneOffset(offsetHours: number): string {
  if (offsetHours === 0) return 'UTC'

  const sign = offsetHours >= 0 ? '+' : '-'
  const absOffset = Math.abs(offsetHours)
  const hours = Math.floor(absOffset)
  const minutes = Math.round((absOffset - hours) * 60)

  if (minutes === 0) {
    return `UTC${sign}${hours}`
  }
  return `UTC${sign}${hours}:${minutes.toString().padStart(2, '0')}`
}
