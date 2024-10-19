import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { useParams, useNavigate, NavigateFunction } from 'react-router-dom'
import { Versions } from '../../src/pages/Versions'
import { useRevisions } from '../../src/hooks/useRevisions'

vi.mock('../../src/hooks/useRevisions')
vi.mock('react-router-dom')

describe('<Versions />', () => {
  const mockMetadata = { totalCount: 2, totalPages: 1, currentPage: 1 }
  const mockRevisions = [
    { id: 'test-id-1', revision: 1, createdAt: '2023-01-01T12:00:00Z', data: {} },
    { id: 'test-id-2', revision: 2, createdAt: '2023-01-02T12:00:00Z', data: {} },
  ]

  beforeEach(() => {
    vi.mocked(useRevisions).mockReturnValue({ revisions: mockRevisions, metadata: mockMetadata, error: null })
    vi.mocked(useParams).mockReturnValue({ id: '123' })
    vi.mocked(useNavigate).mockReturnValue(vi.fn() as unknown as NavigateFunction)
  })

  test('rendering: component renders without crashing', () => {
    const { container } = render(<Versions />)
    expect(container).toMatchSnapshot()
  })

  test('displays correct content', () => {
    render(<Versions externalId="ext123" />)

    expect(screen.getByText('Resource Revisions')).toBeInTheDocument()
    expect(screen.getByText('External ID: ext123')).toBeInTheDocument()
    expect(screen.getByText('test-id-1')).toBeInTheDocument()
    expect(screen.getByText('test-id-2')).toBeInTheDocument()
  })

  test('handles pagination', async () => {
    vi.mocked(useRevisions).mockReturnValue({
      revisions: mockRevisions,
      metadata: { ...mockMetadata, totalPages: 2 },
      error: null,
    })

    render(<Versions />)

    const nextButton = screen.getByText('»')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(useRevisions).toHaveBeenCalledWith('123', 2, 10)
    })
  })

  test('displays error message when error occurs', () => {
    vi.mocked(useRevisions).mockReturnValue({ revisions: null, metadata: mockMetadata, error: new Error('Test error') })

    render(<Versions />)

    expect(screen.getByText('Error: Test error')).toBeInTheDocument()
  })

  test('renders expanded row on row click', async () => {
    render(<Versions />)

    const firstRow = screen.getByText('1').closest('tr')
    fireEvent.click(firstRow!)

    await waitFor(() => {
      expect(screen.getByText('Data Comparison for Revision 1')).toBeInTheDocument()
    })
  })
})
