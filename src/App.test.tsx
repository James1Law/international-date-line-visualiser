import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the header with title', () => {
    render(<App />)
    expect(screen.getByText("SHIP'S TIME ZONE VISUALIZER")).toBeInTheDocument()
  })

  it('renders the map container', () => {
    render(<App />)
    expect(screen.getByTestId('map-container')).toBeInTheDocument()
  })

  it('renders the ship position panel', () => {
    render(<App />)
    expect(screen.getByTestId('ship-position-panel')).toBeInTheDocument()
  })
})
