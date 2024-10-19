import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { useNavigate, NavigateFunction } from 'react-router-dom'
import { Resources } from '../../src/pages/Resources'
import { useSearch } from '../../src/hooks'

vi.mock('../../src/hooks/useSearch')
vi.mock('react-router-dom')

describe('<Resources />', () => {
  const mockMetadata = { totalCount: 2, totalPages: 1, currentPage: 1 }
  const mockRecords = [
    {
      id: '1',
      externalId: 'ext1',
      type: 'user',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      lastVersion: { revision: 1, createdAt: '2023-01-01T00:00:00Z', data: {}, id: '1' },
    },
    {
      id: '2',
      externalId: 'ext2',
      type: 'post',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      lastVersion: { revision: 2, createdAt: '2023-01-02T00:00:00Z', data: {}, id: '2' },
    },
  ]

  beforeEach(() => {
    vi.mocked(useSearch).mockReturnValue({ records: mockRecords, metadata: mockMetadata, error: null })
    vi.mocked(useNavigate).mockReturnValue(vi.fn() as unknown as NavigateFunction)
  })

  test('rendering: component renders without crashing', () => {
    const { container } = render(<Resources />)
    expect(container).toMatchSnapshot()
  })

  test('displays correct content', () => {
    render(<Resources />)

    expect(screen.getByText('Advanced Audit Log')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search by ID or type...')).toBeInTheDocument()
    expect(screen.getByText('ext1')).toBeInTheDocument()
    expect(screen.getByText('user')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  test('handles search action', async () => {
    render(<Resources />)

    const searchInput = screen.getByPlaceholderText('Search by ID or type...')
    fireEvent.change(searchInput, { target: { value: 'test query' } })
    fireEvent.keyUp(searchInput, { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(useSearch).toHaveBeenCalledWith('test query', 1, 10)
    })
  })

  test('handles pagination', async () => {
    vi.mocked(useSearch).mockReturnValue({
      records: mockRecords,
      metadata: { ...mockMetadata, totalPages: 2 },
      error: null,
    })

    render(<Resources />)

    const nextButton = screen.getByText('»')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(useSearch).toHaveBeenCalledWith('', 2, 10)
    })
  })

  test('handles row click', () => {
    const mockNavigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    render(<Resources />)

    const firstRow = screen.getByText('ext1').closest('tr')
    fireEvent.click(firstRow!)

    expect(mockNavigate).toHaveBeenCalledWith('/1', { state: { externalId: 'ext1' } })
  })

  test('displays error message when error occurs', () => {
    vi.mocked(useSearch).mockReturnValue({ records: null, metadata: mockMetadata, error: new Error('Test error') })

    render(<Resources />)

    expect(screen.getByText('Error: Test error')).toBeInTheDocument()
  })
})
