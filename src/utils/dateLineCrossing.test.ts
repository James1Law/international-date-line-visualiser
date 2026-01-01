import { detectDateLineCrossing } from './dateLineCrossing'

describe('detectDateLineCrossing', () => {
  it('returns null when longitude stays in eastern hemisphere', () => {
    expect(detectDateLineCrossing(150, 160)).toBeNull()
  })

  it('returns null when longitude stays in western hemisphere', () => {
    expect(detectDateLineCrossing(-150, -160)).toBeNull()
  })

  it('returns null for small movements near the prime meridian', () => {
    expect(detectDateLineCrossing(-10, 10)).toBeNull()
  })

  it('detects eastward crossing (date goes back)', () => {
    // Moving from 170 to -170 is crossing eastward
    const result = detectDateLineCrossing(170, -170)
    expect(result).toEqual({
      direction: 'east',
      message: 'Crossed the Date Line heading East - subtract one day',
    })
  })

  it('detects westward crossing (date goes forward)', () => {
    // Moving from -170 to 170 is crossing westward
    const result = detectDateLineCrossing(-170, 170)
    expect(result).toEqual({
      direction: 'west',
      message: 'Crossed the Date Line heading West - add one day',
    })
  })

  it('handles edge case at exactly 180', () => {
    const result = detectDateLineCrossing(180, -179)
    expect(result?.direction).toBe('east')
  })

  it('handles edge case at exactly -180', () => {
    const result = detectDateLineCrossing(-180, 179)
    expect(result?.direction).toBe('west')
  })
})
