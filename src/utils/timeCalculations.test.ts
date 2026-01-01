import { DateTime } from 'luxon'
import {
  normalizeLongitude,
  calculateTimezoneOffset,
  calculateShipTime,
  formatLongitude,
  formatTime,
  formatDate,
} from './timeCalculations'

describe('timeCalculations', () => {
  describe('normalizeLongitude', () => {
    it('returns 0 for longitude 0', () => {
      expect(normalizeLongitude(0)).toBe(0)
    })

    it('returns same value for longitude within -180 to 180', () => {
      expect(normalizeLongitude(45)).toBe(45)
      expect(normalizeLongitude(-45)).toBe(-45)
      expect(normalizeLongitude(179)).toBe(179)
      expect(normalizeLongitude(-179)).toBe(-179)
    })

    it('returns 180 for longitude 180', () => {
      expect(normalizeLongitude(180)).toBe(180)
    })

    it('returns -180 for longitude -180', () => {
      expect(normalizeLongitude(-180)).toBe(-180)
    })

    it('wraps longitude greater than 180 to negative range', () => {
      expect(normalizeLongitude(181)).toBe(-179)
      expect(normalizeLongitude(190)).toBe(-170)
      expect(normalizeLongitude(270)).toBe(-90)
      expect(normalizeLongitude(360)).toBe(0)
    })

    it('wraps longitude less than -180 to positive range', () => {
      expect(normalizeLongitude(-181)).toBe(179)
      expect(normalizeLongitude(-190)).toBe(170)
      expect(normalizeLongitude(-270)).toBe(90)
      expect(normalizeLongitude(-360)).toBe(0)
    })

    it('handles multiple wraps', () => {
      expect(normalizeLongitude(540)).toBe(180) // 360 + 180
      expect(normalizeLongitude(-540)).toBe(-180) // -360 - 180
      expect(normalizeLongitude(720)).toBe(0) // 2 full rotations
    })
  })
  describe('calculateTimezoneOffset', () => {
    it('returns 0 for longitude 0 (prime meridian)', () => {
      expect(calculateTimezoneOffset(0)).toBe(0)
    })

    it('returns +1 for longitude 15 (UTC+1)', () => {
      expect(calculateTimezoneOffset(15)).toBe(1)
    })

    it('returns -1 for longitude -15 (UTC-1)', () => {
      expect(calculateTimezoneOffset(-15)).toBe(-1)
    })

    it('returns +12 for longitude 180', () => {
      expect(calculateTimezoneOffset(180)).toBe(12)
    })

    it('returns -12 for longitude -180', () => {
      expect(calculateTimezoneOffset(-180)).toBe(-12)
    })

    it('rounds to nearest hour for intermediate longitudes', () => {
      expect(calculateTimezoneOffset(7)).toBe(0) // 7/15 = 0.47 -> rounds to 0
      expect(calculateTimezoneOffset(8)).toBe(1) // 8/15 = 0.53 -> rounds to 1
      expect(calculateTimezoneOffset(22)).toBe(1) // 22/15 = 1.47 -> rounds to 1
      expect(calculateTimezoneOffset(23)).toBe(2) // 23/15 = 1.53 -> rounds to 2
    })
  })

  describe('calculateShipTime', () => {
    it('returns same time as UTC for longitude 0', () => {
      const utc = DateTime.utc(2026, 1, 15, 12, 0)
      const shipTime = calculateShipTime(utc, 0)
      expect(shipTime.hour).toBe(12)
      expect(shipTime.minute).toBe(0)
    })

    it('adds hours for positive longitude (east)', () => {
      const utc = DateTime.utc(2026, 1, 15, 12, 0)
      const shipTime = calculateShipTime(utc, 90) // +6 hours
      expect(shipTime.hour).toBe(18)
    })

    it('subtracts hours for negative longitude (west)', () => {
      const utc = DateTime.utc(2026, 1, 15, 12, 0)
      const shipTime = calculateShipTime(utc, -90) // -6 hours
      expect(shipTime.hour).toBe(6)
    })

    it('handles day rollover for positive offset', () => {
      const utc = DateTime.utc(2026, 1, 15, 23, 0)
      const shipTime = calculateShipTime(utc, 45) // +3 hours
      expect(shipTime.hour).toBe(2)
      expect(shipTime.day).toBe(16)
    })

    it('handles day rollover for negative offset', () => {
      const utc = DateTime.utc(2026, 1, 15, 1, 0)
      const shipTime = calculateShipTime(utc, -45) // -3 hours
      expect(shipTime.hour).toBe(22)
      expect(shipTime.day).toBe(14)
    })
  })

  describe('formatLongitude', () => {
    it('formats 0 as 0°00\'E', () => {
      expect(formatLongitude(0)).toBe("0°00'E")
    })

    it('formats positive longitude with E suffix', () => {
      expect(formatLongitude(45.5)).toBe("45°30'E")
    })

    it('formats negative longitude with W suffix', () => {
      expect(formatLongitude(-45.5)).toBe("45°30'W")
    })

    it('formats whole degrees correctly', () => {
      expect(formatLongitude(120)).toBe("120°00'E")
    })

    it('handles 180 degrees', () => {
      expect(formatLongitude(180)).toBe("180°00'E")
      expect(formatLongitude(-180)).toBe("180°00'W")
    })
  })

  describe('formatTime', () => {
    it('formats time in 24-hour format', () => {
      const dt = DateTime.utc(2026, 1, 15, 14, 30)
      expect(formatTime(dt)).toBe('14:30')
    })

    it('pads single digit hours and minutes', () => {
      const dt = DateTime.utc(2026, 1, 15, 9, 5)
      expect(formatTime(dt)).toBe('09:05')
    })

    it('handles midnight', () => {
      const dt = DateTime.utc(2026, 1, 15, 0, 0)
      expect(formatTime(dt)).toBe('00:00')
    })
  })

  describe('formatDate', () => {
    it('formats date as "D MMMM YYYY"', () => {
      const dt = DateTime.utc(2026, 1, 15, 12, 0)
      expect(formatDate(dt)).toBe('15 January 2026')
    })

    it('handles single digit days', () => {
      const dt = DateTime.utc(2026, 3, 5, 12, 0)
      expect(formatDate(dt)).toBe('5 March 2026')
    })
  })
})
