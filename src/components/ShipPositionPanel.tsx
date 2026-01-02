import { DateTime } from 'luxon'
import {
  getTimezoneOffset,
  getTimezoneFromCoordinates,
  calculateShipTime,
  formatLongitude,
  formatTime,
  formatDate,
  formatTimezoneOffset,
} from '../utils/timeCalculations'

interface ShipPositionPanelProps {
  latitude: number
  longitude: number
  utcTime: DateTime
}

export default function ShipPositionPanel({ latitude, longitude, utcTime }: ShipPositionPanelProps) {
  const offset = getTimezoneOffset(latitude, longitude)
  const timezone = getTimezoneFromCoordinates(latitude, longitude)
  const shipTime = calculateShipTime(utcTime, latitude, longitude)

  return (
    <div className="p-4 grid grid-cols-3 gap-6 text-[#1A1A1A]" data-testid="ship-position-panel">
      <div>
        <div className="text-sm font-semibold uppercase tracking-wide text-gray-600">Longitude</div>
        <div className="text-2xl font-mono">{formatLongitude(longitude)}</div>
      </div>
      <div>
        <div className="text-sm font-semibold uppercase tracking-wide text-gray-600">
          Ship's Date & Time <span className="text-xs font-normal">({formatTimezoneOffset(offset)})</span>
        </div>
        <div className="text-2xl font-mono">{formatDate(shipTime)}</div>
        <div className="text-xl font-mono text-gray-700">{formatTime(shipTime)}</div>
        <div className="text-xs text-gray-500 mt-1">{timezone}</div>
      </div>
      <div>
        <div className="text-sm font-semibold uppercase tracking-wide text-gray-600">
          UTC Date & Time
        </div>
        <div className="text-2xl font-mono">{formatDate(utcTime)}</div>
        <div className="text-xl font-mono text-gray-700">{formatTime(utcTime)}</div>
      </div>
    </div>
  )
}
