import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { Search } from '../../src/components/Search'

describe('<Search />', () => {
  test('rendering: component renders without crashing', () => {
    const onSearch = vi.fn()
    const { container } = render(<Search onSearch={onSearch} />)
    expect(container).toMatchSnapshot()
  })

  test('input field renders correctly', () => {
    const onSearch = vi.fn()
    render(<Search onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('Search by ID or type...')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass(
      'w-full md:w-3/4 p-4 rounded-full border-0 focus:ring-2 focus:ring-indigo-300 transition text-gray-700 text-lg',
    )
  })

  test('search button renders correctly', () => {
    const onSearch = vi.fn()
    render(<Search onSearch={onSearch} />)

    const button = screen.getByText('Search')
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass(
      'w-full md:w-auto px-10 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out',
    )
  })

  test('input updates on change', () => {
    const onSearch = vi.fn()
    render(<Search onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('Search by ID or type...')
    fireEvent.change(input, { target: { value: 'test query' } })
    expect(input).toHaveValue('test query')
  })

  test('onSearch is called when search button is clicked', () => {
    const onSearch = vi.fn()
    render(<Search onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('Search by ID or type...')
    fireEvent.change(input, { target: { value: 'test query' } })

    const button = screen.getByText('Search')
    fireEvent.click(button)

    expect(onSearch).toHaveBeenCalledWith('test query')
  })

  test('onSearch is called when Enter key is pressed', () => {
    const onSearch = vi.fn()
    render(<Search onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('Search by ID or type...')
    fireEvent.change(input, { target: { value: 'test query' } })
    fireEvent.keyUp(input, { key: 'Enter', code: 'Enter' })

    expect(onSearch).toHaveBeenCalledWith('test query')
  })

  test('onSearch is not called for other key presses', () => {
    const onSearch = vi.fn()
    render(<Search onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('Search by ID or type...')
    fireEvent.change(input, { target: { value: 'test query' } })
    fireEvent.keyUp(input, { key: 'A', code: 'KeyA' })

    expect(onSearch).not.toHaveBeenCalled()
  })
})
