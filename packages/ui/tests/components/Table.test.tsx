import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { Table } from '../../src/components/Table'

describe('<Table />', () => {
  const mockData = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
  ]

  const mockColumns = [
    { header: 'ID', accessor: 'id' as const },
    { header: 'Name', accessor: 'name' as const },
    { header: 'Age', accessor: 'age' as const },
  ] as const

  test('rendering: component renders without crashing', () => {
    const { container } = render(<Table data={mockData} columns={mockColumns} />)
    expect(container).toMatchSnapshot()
  })

  test('displays correct headers', () => {
    render(<Table data={mockData} columns={mockColumns} />)
    mockColumns.forEach((column) => {
      expect(screen.getByText(column.header)).toBeInTheDocument()
    })
  })

  test('displays correct data', () => {
    render(<Table data={mockData} columns={mockColumns} />)
    mockData.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument()
      expect(screen.getByText(item.age.toString())).toBeInTheDocument()
    })
  })

  test('handles empty data', () => {
    render(<Table data={[]} columns={mockColumns} />)
    expect(screen.getByText('No records found')).toBeInTheDocument()
  })

  test('calls onRowClick when row is clicked', () => {
    const onRowClick = vi.fn()
    render(<Table data={mockData} columns={mockColumns} onRowClick={onRowClick} />)

    fireEvent.click(screen.getByText('John Doe'))
    expect(onRowClick).toHaveBeenCalledWith(mockData[0])
  })

  test('expands row when clicked and renderExpandedRow is provided', () => {
    const renderExpandedRow = vi.fn().mockReturnValue(<div>Expanded Content</div>)
    render(<Table data={mockData} columns={mockColumns} renderExpandedRow={renderExpandedRow} />)

    fireEvent.click(screen.getByText('John Doe'))
    expect(screen.getByText('Expanded Content')).toBeInTheDocument()

    fireEvent.click(screen.getByText('John Doe'))
    expect(screen.queryByText('Expanded Content')).not.toBeInTheDocument()
  })

  test('renders custom cell content using render prop', () => {
    const customColumns = [
      ...mockColumns,
      {
        header: 'Custom',
        accessor: 'id' as keyof (typeof mockData)[0],
        render: (item: (typeof mockData)[0]) => <span>Custom {item.id}</span>,
      },
    ]

    render(<Table data={mockData} columns={customColumns} />)
    expect(screen.getByText('Custom 1')).toBeInTheDocument()
    expect(screen.getByText('Custom 2')).toBeInTheDocument()
  })
})
