import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { Pagination } from '../../src/components/Pagination'

describe('<Pagination />', () => {
  const defaultProps = {
    metadata: {
      totalCount: 100,
      currentPage: 2,
      totalPages: 10,
    },
    itemsPerPage: 10,
    onPrevPage: vi.fn(),
    onNextPage: vi.fn(),
  }

  test('renders pagination component correctly', () => {
    render(<Pagination {...defaultProps} />)

    expect(screen.getByText('Showing 10 of 100 entries')).toBeInTheDocument()
    expect(screen.getByText('Page 2 of 10')).toBeInTheDocument()
    expect(screen.getByText('«')).toBeInTheDocument()
    expect(screen.getByText('»')).toBeInTheDocument()
  })

  test('calls onPrevPage when previous button is clicked', () => {
    render(<Pagination {...defaultProps} />)
    fireEvent.click(screen.getByText('«'))
    expect(defaultProps.onPrevPage).toHaveBeenCalledTimes(1)
  })

  test('calls onNextPage when next button is clicked', () => {
    render(<Pagination {...defaultProps} />)
    fireEvent.click(screen.getByText('»'))
    expect(defaultProps.onNextPage).toHaveBeenCalledTimes(1)
  })

  test('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} metadata={{ ...defaultProps.metadata, currentPage: 1 }} />)
    expect(screen.getByText('«')).toBeDisabled()
  })

  test('disables next button on last page', () => {
    render(<Pagination {...defaultProps} metadata={{ ...defaultProps.metadata, currentPage: 10 }} />)
    expect(screen.getByText('»')).toBeDisabled()
  })
})
