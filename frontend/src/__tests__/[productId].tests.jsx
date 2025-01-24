import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ProductDetail from '@/pages/products/[productId]'


describe('Product Detail Page', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Trek',
    description: 'A beautiful trek',
    duration: 5,
    location: 'Nepal',
    difficulty: 'Moderate',
  }

  it('renders product name', () => {
    render(<ProductDetail product={mockProduct} departures={[]} />)
    const heading = screen.getByText('Test Trek')
    expect(heading).toBeInTheDocument()
  })

  it('renders product location', () => {
    render(<ProductDetail product={mockProduct} departures={[]} />)
    const location = screen.getByText('Nepal')
    expect(location).toBeInTheDocument()
  })

  it('renders duration', () => {
    render(<ProductDetail product={mockProduct} departures={[]} />)
    const duration = screen.getByText('5 Days')
    expect(duration).toBeInTheDocument()
  })

  it('shows no departures message when empty', () => {
    render(<ProductDetail product={mockProduct} departures={[]} />)
    const message = screen.getByText('No departures are currently scheduled for this trip.')
    expect(message).toBeInTheDocument()
  })

  it('renders departure details when available', () => {
    const departures = [{
      id: 1,
      start_date: '2024-06-01',
      price: 2500,
      booked_pax: 5,
      max_pax: 10
    }]

    render(<ProductDetail product={mockProduct} departures={departures} />)
    const date = screen.getByText('Start Date: 01/06/2024')
    const price = screen.getByText('Price: $2500')

    expect(date).toBeInTheDocument()
    expect(price).toBeInTheDocument()
  })
})