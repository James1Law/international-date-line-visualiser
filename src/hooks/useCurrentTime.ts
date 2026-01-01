import { useState, useEffect } from 'react'
import { DateTime } from 'luxon'

/**
 * Hook that provides the current UTC time, updating every second.
 */
export function useCurrentTime(): DateTime {
  const [time, setTime] = useState(() => DateTime.utc())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(DateTime.utc())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return time
}
