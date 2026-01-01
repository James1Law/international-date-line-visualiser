import type { DateLineCrossing } from '../utils/dateLineCrossing'

interface DateLineAlertProps {
  crossing: DateLineCrossing | null
}

export default function DateLineAlert({ crossing }: DateLineAlertProps) {
  if (!crossing) {
    return null
  }

  const isEast = crossing.direction === 'east'
  const dayChange = isEast ? '-1 DAY' : '+1 DAY'
  const bgColor = isEast ? 'bg-blue-600' : 'bg-orange-600'

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-pulse`}
      data-testid="date-line-alert"
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold">{dayChange}</div>
        <div className="text-lg">{crossing.message}</div>
      </div>
    </div>
  )
}
