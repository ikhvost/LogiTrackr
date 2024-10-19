import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { Diff } from '../../src/components/Diff'

describe('<Diff />', () => {
  test('rendering: component renders without crashing', () => {
    const oldData = { name: 'John', age: 30 }
    const currentData = { name: 'John', age: 31 }

    const { container } = render(<Diff oldData={oldData} currentData={currentData} />)

    expect(container).toMatchSnapshot()
  })

  test('displays correct content for previous and current versions', () => {
    const oldData = { name: 'John', age: 30 }
    const currentData = { name: 'John', age: 31 }

    render(<Diff oldData={oldData} currentData={currentData} />)

    expect(screen.getByText('Previous Version')).toBeInTheDocument()
    expect(screen.getAllByText('"name": "John"', { exact: false })).toHaveLength(2)
    expect(screen.getByText('"age": 30', { exact: false })).toBeInTheDocument()

    expect(screen.getByText('Current Version')).toBeInTheDocument()
    expect(screen.getByText('"age": 31', { exact: false })).toBeInTheDocument()
  })

  test('highlights added and removed content', () => {
    const oldData = { name: 'John', age: 30 }
    const currentData = { name: 'John', age: 31, city: 'New York' }

    render(<Diff oldData={oldData} currentData={currentData} />)

    const removedContent = screen.getByText('"age": 30', { exact: false })
    expect(removedContent).toHaveClass('bg-red-100')
    expect(removedContent).toHaveClass('text-red-800')

    const addedContent = screen.getByText('"age": 31', { exact: false })
    expect(addedContent).toHaveClass('bg-green-100')
    expect(addedContent).toHaveClass('text-green-800')

    const newAddedContent = screen.getByText('"city": "New York"', { exact: false })
    expect(newAddedContent).toHaveClass('bg-green-100')
    expect(newAddedContent).toHaveClass('text-green-800')
  })

  test('handles empty objects correctly', () => {
    const oldData = {}
    const currentData = { name: 'John' }

    render(<Diff oldData={oldData} currentData={currentData} />)

    expect(screen.getByText('Previous Version')).toBeInTheDocument()
    expect(screen.getByText('{}', { exact: false })).toBeInTheDocument()

    expect(screen.getByText('Current Version')).toBeInTheDocument()
    expect(screen.getByText('"name": "John"', { exact: false })).toBeInTheDocument()
  })

  test('handles null and undefined values', () => {
    const oldData = { name: 'John', age: null }
    const currentData = { name: 'John', age: undefined }

    render(<Diff oldData={oldData} currentData={currentData} />)

    expect(screen.getByText('"age": null', { exact: false })).toBeInTheDocument()
    expect(screen.queryByText('"age": undefined', { exact: false })).not.toBeInTheDocument()
  })

  test('handles complex nested objects', () => {
    const oldData = {
      user: {
        name: 'John',
        address: { city: 'New York', country: 'USA' },
      },
    }
    const currentData = {
      user: {
        name: 'John',
        address: { city: 'Los Angeles', country: 'USA' },
      },
    }

    render(<Diff oldData={oldData} currentData={currentData} />)

    expect(screen.getByText('"city": "New York"', { exact: false })).toHaveClass('bg-red-100')
    expect(screen.getByText('"city": "Los Angeles"', { exact: false })).toHaveClass('bg-green-100')
  })
})
