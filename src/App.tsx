import { useEffect, useRef, useState } from 'react'
import MapContainer from './components/MapContainer'
import ShipPositionPanel from './components/ShipPositionPanel'
import DateLineAlert from './components/DateLineAlert'
import { useCurrentTime } from './hooks/useCurrentTime'
import { detectDateLineCrossing, type DateLineCrossing } from './utils/dateLineCrossing'

function App() {
  const utcTime = useCurrentTime()
  const [shipLongitude, setShipLongitude] = useState(0)
  const [dateLineCrossing, setDateLineCrossing] = useState<DateLineCrossing | null>(null)
  const prevLongitudeRef = useRef<number>(0)

  // Detect date line crossings
  useEffect(() => {
    const crossing = detectDateLineCrossing(prevLongitudeRef.current, shipLongitude)
    if (crossing) {
      setDateLineCrossing(crossing)
      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        setDateLineCrossing(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
    prevLongitudeRef.current = shipLongitude
  }, [shipLongitude])

  const handlePositionChange = (longitude: number) => {
    setShipLongitude(longitude)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#2C5F7C]">
      <header className="bg-[#1a3d4d] text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">
          SHIP'S TIME ZONE VISUALIZER
        </h1>
      </header>

      <DateLineAlert crossing={dateLineCrossing} />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <MapContainer
            shipLongitude={shipLongitude}
            onPositionChange={handlePositionChange}
          />
        </div>

        <div className="bg-[#E8DCC4] border-t-4 border-[#D4C5A9]">
          <ShipPositionPanel longitude={shipLongitude} utcTime={utcTime} />
        </div>
      </main>
    </div>
  )
}

export default App
