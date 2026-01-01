import { render, screen, fireEvent } from '@testing-library/react'
import RouteControls from './RouteControls'

describe('RouteControls', () => {
  const defaultProps = {
    isDrawingRoute: false,
    isAnimating: false,
    hasRoute: false,
    speed: 'medium' as const,
    onToggleDrawingMode: vi.fn(),
    onClearRoute: vi.fn(),
    onStartAnimation: vi.fn(),
    onStopAnimation: vi.fn(),
    onSpeedChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the route controls', () => {
    render(<RouteControls {...defaultProps} />)
    expect(screen.getByTestId('route-controls')).toBeInTheDocument()
  })

  describe('Draw Route button', () => {
    it('shows "Draw Route" when not in drawing mode', () => {
      render(<RouteControls {...defaultProps} isDrawingRoute={false} />)
      expect(screen.getByRole('button', { name: /draw route/i })).toBeInTheDocument()
    })

    it('shows "Stop Drawing" when in drawing mode', () => {
      render(<RouteControls {...defaultProps} isDrawingRoute={true} />)
      expect(screen.getByRole('button', { name: /stop drawing/i })).toBeInTheDocument()
    })

    it('calls onToggleDrawingMode when clicked', () => {
      const onToggle = vi.fn()
      render(<RouteControls {...defaultProps} onToggleDrawingMode={onToggle} />)
      fireEvent.click(screen.getByRole('button', { name: /draw route/i }))
      expect(onToggle).toHaveBeenCalledTimes(1)
    })

    it('is disabled during animation', () => {
      render(<RouteControls {...defaultProps} isAnimating={true} />)
      expect(screen.getByRole('button', { name: /draw route/i })).toBeDisabled()
    })
  })

  describe('Clear button', () => {
    it('renders Clear button', () => {
      render(<RouteControls {...defaultProps} />)
      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
    })

    it('calls onClearRoute when clicked', () => {
      const onClear = vi.fn()
      render(<RouteControls {...defaultProps} hasRoute={true} onClearRoute={onClear} />)
      fireEvent.click(screen.getByRole('button', { name: /clear/i }))
      expect(onClear).toHaveBeenCalledTimes(1)
    })

    it('is disabled when there is no route', () => {
      render(<RouteControls {...defaultProps} hasRoute={false} />)
      expect(screen.getByRole('button', { name: /clear/i })).toBeDisabled()
    })

    it('is enabled when there is a route', () => {
      render(<RouteControls {...defaultProps} hasRoute={true} />)
      expect(screen.getByRole('button', { name: /clear/i })).not.toBeDisabled()
    })
  })

  describe('Play/Stop button', () => {
    it('shows "Play" when not animating', () => {
      render(<RouteControls {...defaultProps} isAnimating={false} hasRoute={true} />)
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
    })

    it('shows "Stop" when animating', () => {
      render(<RouteControls {...defaultProps} isAnimating={true} hasRoute={true} />)
      expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument()
    })

    it('calls onStartAnimation when Play is clicked', () => {
      const onStart = vi.fn()
      render(<RouteControls {...defaultProps} hasRoute={true} onStartAnimation={onStart} />)
      fireEvent.click(screen.getByRole('button', { name: /play/i }))
      expect(onStart).toHaveBeenCalledTimes(1)
    })

    it('calls onStopAnimation when Stop is clicked', () => {
      const onStop = vi.fn()
      render(<RouteControls {...defaultProps} isAnimating={true} hasRoute={true} onStopAnimation={onStop} />)
      fireEvent.click(screen.getByRole('button', { name: /stop/i }))
      expect(onStop).toHaveBeenCalledTimes(1)
    })

    it('is disabled when there is no route', () => {
      render(<RouteControls {...defaultProps} hasRoute={false} />)
      expect(screen.getByRole('button', { name: /play/i })).toBeDisabled()
    })
  })

  describe('Speed control', () => {
    it('renders speed dropdown with current value', () => {
      render(<RouteControls {...defaultProps} speed="fast" />)
      expect(screen.getByRole('combobox')).toHaveValue('fast')
    })

    it('calls onSpeedChange when selection changes', () => {
      const onSpeedChange = vi.fn()
      render(<RouteControls {...defaultProps} onSpeedChange={onSpeedChange} />)
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'slow' } })
      expect(onSpeedChange).toHaveBeenCalledWith('slow')
    })
  })
})
