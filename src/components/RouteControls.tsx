import type { Speed } from '../hooks/useRoute'

interface RouteControlsProps {
  isDrawingRoute: boolean
  isAnimating: boolean
  hasRoute: boolean
  speed: Speed
  onToggleDrawingMode: () => void
  onClearRoute: () => void
  onStartAnimation: () => void
  onStopAnimation: () => void
  onSpeedChange: (speed: Speed) => void
}

export default function RouteControls({
  isDrawingRoute,
  isAnimating,
  hasRoute,
  speed,
  onToggleDrawingMode,
  onClearRoute,
  onStartAnimation,
  onStopAnimation,
  onSpeedChange,
}: RouteControlsProps) {
  const handlePlayStop = () => {
    if (isAnimating) {
      onStopAnimation()
    } else {
      onStartAnimation()
    }
  }

  return (
    <div className="p-4 border-t border-[#D4C5A9] flex gap-4 items-center" data-testid="route-controls">
      <button
        onClick={onToggleDrawingMode}
        disabled={isAnimating}
        className="px-4 py-2 bg-[#2C5F7C] text-white rounded hover:bg-[#1a3d4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDrawingRoute ? 'Stop Drawing' : 'Draw Route'}
      </button>
      <button
        onClick={onClearRoute}
        disabled={!hasRoute}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Clear
      </button>
      <button
        onClick={handlePlayStop}
        disabled={!hasRoute}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnimating ? 'Stop ⬛' : 'Play ▶'}
      </button>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm font-semibold">Speed:</span>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(e.target.value as Speed)}
          className="px-3 py-2 rounded border border-gray-300 bg-white"
        >
          <option value="slow">Slow</option>
          <option value="medium">Medium</option>
          <option value="fast">Fast</option>
        </select>
      </div>
    </div>
  )
}
