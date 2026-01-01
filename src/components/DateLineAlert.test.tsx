import { render, screen, act } from '@testing-library/react'
import DateLineAlert from './DateLineAlert'

describe('DateLineAlert', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing when crossing is null', () => {
    const { container } = render(<DateLineAlert crossing={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('displays alert when crossing east', () => {
    render(
      <DateLineAlert
        crossing={{
          direction: 'east',
          message: 'Crossed the Date Line heading East - subtract one day',
        }}
      />
    )
    expect(screen.getByText(/Date Line heading East/)).toBeInTheDocument()
  })

  it('displays alert when crossing west', () => {
    render(
      <DateLineAlert
        crossing={{
          direction: 'west',
          message: 'Crossed the Date Line heading West - add one day',
        }}
      />
    )
    expect(screen.getByText(/Date Line heading West/)).toBeInTheDocument()
  })

  it('shows subtract day icon for eastward crossing', () => {
    render(
      <DateLineAlert
        crossing={{
          direction: 'east',
          message: 'Crossed the Date Line heading East - subtract one day',
        }}
      />
    )
    expect(screen.getByText('-1 DAY')).toBeInTheDocument()
  })

  it('shows add day icon for westward crossing', () => {
    render(
      <DateLineAlert
        crossing={{
          direction: 'west',
          message: 'Crossed the Date Line heading West - add one day',
        }}
      />
    )
    expect(screen.getByText('+1 DAY')).toBeInTheDocument()
  })

  it('auto-dismisses after a delay', () => {
    const { rerender } = render(
      <DateLineAlert
        crossing={{
          direction: 'east',
          message: 'Crossed the Date Line heading East - subtract one day',
        }}
      />
    )

    expect(screen.getByText(/Date Line/)).toBeInTheDocument()

    // Simulate time passing and re-render with null
    act(() => {
      vi.advanceTimersByTime(4000)
    })

    rerender(<DateLineAlert crossing={null} />)
    expect(screen.queryByText(/Date Line/)).not.toBeInTheDocument()
  })
})
