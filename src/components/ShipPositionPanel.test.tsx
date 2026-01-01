import { render, screen } from '@testing-library/react'
import { DateTime } from 'luxon'
import ShipPositionPanel from './ShipPositionPanel'

describe('ShipPositionPanel', () => {
  const defaultProps = {
    longitude: 0,
    utcTime: DateTime.utc(2026, 1, 15, 12, 0),
  }

  it('displays the longitude in degrees and minutes format', () => {
    render(<ShipPositionPanel {...defaultProps} longitude={45.5} />)
    expect(screen.getByText("45°30'E")).toBeInTheDocument()
  })

  it('displays W for western longitudes', () => {
    render(<ShipPositionPanel {...defaultProps} longitude={-120} />)
    expect(screen.getByText("120°00'W")).toBeInTheDocument()
  })

  it('displays ship time with timezone offset', () => {
    render(<ShipPositionPanel {...defaultProps} longitude={90} />)
    // UTC 12:00 + 6 hours (90° = UTC+6) = 18:00
    expect(screen.getByText('18:00')).toBeInTheDocument()
    expect(screen.getByText('(UTC+6)')).toBeInTheDocument()
  })

  it('displays both ship and UTC date/time sections', () => {
    render(<ShipPositionPanel {...defaultProps} />)
    expect(screen.getByText("Ship's Date & Time", { exact: false })).toBeInTheDocument()
    expect(screen.getByText('UTC Date & Time')).toBeInTheDocument()
  })

  it('displays UTC time', () => {
    render(<ShipPositionPanel {...defaultProps} />)
    // Both ship time and UTC time show 12:00 when at longitude 0
    const times = screen.getAllByText('12:00')
    expect(times.length).toBe(2)
  })

  it('displays dates for both ship and UTC', () => {
    render(<ShipPositionPanel {...defaultProps} />)
    // When at longitude 0, both dates are the same
    const dates = screen.getAllByText('15 January 2026')
    expect(dates.length).toBe(2)
  })

  it('shows different dates when ship time crosses midnight', () => {
    const utc = DateTime.utc(2026, 1, 15, 23, 0)
    render(<ShipPositionPanel longitude={45} utcTime={utc} />)
    // UTC 23:00 + 3 hours (45° = UTC+3) = 02:00 next day
    // Ship date should be 16 January, UTC date should be 15 January
    expect(screen.getByText('16 January 2026')).toBeInTheDocument()
    expect(screen.getByText('15 January 2026')).toBeInTheDocument()
  })

  it('displays UTC offset label for prime meridian', () => {
    render(<ShipPositionPanel {...defaultProps} longitude={0} />)
    expect(screen.getByText('(UTC+0)')).toBeInTheDocument()
  })

  it('displays negative offset for western longitudes', () => {
    render(<ShipPositionPanel {...defaultProps} longitude={-75} />)
    // -75° = UTC-5
    expect(screen.getByText('(UTC-5)')).toBeInTheDocument()
  })
})
