import { useState, Fragment, ReactNode } from 'react'

interface Column<T> {
  header: string
  accessor: keyof T
  render?: (item: T) => ReactNode
}

interface Props<T> {
  data: T[]
  columns: readonly Column<T>[]
  onRowClick?: (item: T) => void
  renderExpandedRow?: (item: T) => ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Table = <T extends Record<string, any>>({ data, columns, onRowClick, renderExpandedRow }: Props<T>) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const handleRowClick = (item: T, index: number) => {
    if (renderExpandedRow) {
      setExpandedRow(expandedRow === index ? null : index)
    } else if (onRowClick) {
      onRowClick(item)
    }
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th
              key={column.header}
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
              No records found
            </td>
          </tr>
        ) : (
          data.map((item, index) => (
            <Fragment key={index}>
              <tr
                onClick={() => handleRowClick(item, index)}
                className={`cursor-pointer hover:bg-gray-100 ${expandedRow === index ? 'bg-gray-50' : ''}`}
              >
                {columns.map((column) => (
                  <td key={column.header} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(item) : String(item[column.accessor])}
                  </td>
                ))}
              </tr>
              {expandedRow === index && renderExpandedRow && (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4">
                    {renderExpandedRow(item)}
                  </td>
                </tr>
              )}
            </Fragment>
          ))
        )}
      </tbody>
    </table>
  )
}
