import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ProductDetail from '@/pages/products/[productId]'
import { useRouter } from 'next/router'

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}))

describe('Product Detail Page', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      isFallback: false,
    }))
  })

  const mockProduct = {
    id: 1,
    name: 'Test Trip',
    location: 'Test Location',
    duration: 7,
    description: 'Test description',
    difficulty: 'Easy',
  }

  it('renders product name', () => {
    render(<ProductDetail product={mockProduct} departures={[]} />)
    expect(screen.getByText('Test Trip')).toBeInTheDocument()
  })

  it('renders product location', () => {
    render(<ProductDetail product={mockProduct} departures={[]} />)
    expect(screen.getByText(/Test Location/)).toBeInTheDocument()
  })

  it('renders duration', () => {
    render(<ProductDetail product={mockProduct} departures={[]} />)
    expect(screen.getByText(/7 Days/)).toBeInTheDocument()
  })

  it('shows no departures message when empty', () => {
    render(<ProductDetail product={mockProduct} departures={[]} />)
    expect(screen.getByText(/No departures are currently scheduled/)).toBeInTheDocument()
  })

  it('renders departure details when available', () => {
    const mockDepartures = [{
      id: 1,
      start_date: '2024-06-15',
      price: '1999.00',
      booked_pax: 5,
      max_pax: 12
    }]

    render(<ProductDetail product={mockProduct} departures={mockDepartures} />)
    expect(screen.getByText(/15\/06\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/\$1999.00/)).toBeInTheDocument();
    expect(screen.getByText(/Available \(7 spots left\)/)).toBeInTheDocument();
  })
})