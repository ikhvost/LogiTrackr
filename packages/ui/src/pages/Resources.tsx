import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchResponse as Record } from '@saas-versioning/contracts'
import { Table, Pagination, Search } from '../components'
import { useSearch } from '../hooks'

export const Resources = () => {
  const columns = React.useMemo(
    () => [
      {
        header: 'ID',
        accessor: 'id' as keyof Record,
        render: (record: Record) => record.externalId,
      },
      { header: 'Type', accessor: 'type' as keyof Record },
      {
        header: 'Last Updated',
        accessor: 'updatedAt' as keyof Record,
        render: (record: Record) => new Date(record.updatedAt).toLocaleString(),
      },
      {
        header: 'Version',
        accessor: 'lastVersion' as keyof Record,
        render: (record: Record) => record.lastVersion.revision,
      },
    ],
    [],
  )

  const actions = {
    search: (newQuery: string) => {
      setQuery(newQuery)
      setPage(1)
    },
    prevPage: () => {
      if (page > 1) {
        setPage(page - 1)
      }
    },
    nextPage: () => {
      if (page < metadata.totalPages) {
        setPage(page + 1)
      }
    },
    onRowClick: (record: Record) => {
      navigate(`/${record.id}`, { state: { externalId: record.externalId } })
    },
    itemsPerPage: 10,
  }

  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const { records, metadata, error } = useSearch(query, page, actions.itemsPerPage)

  if (error) return <div className="text-red-600">Error: {error.message}</div>

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl shadow-lg mb-12 p-10">
        <h1 className="text-4xl font-bold text-white mb-8">Advanced Audit Log</h1>
        <Search onSearch={actions.search} />
      </div>
      <Table<Record> data={records || []} columns={columns} onRowClick={actions.onRowClick} />
      <Pagination
        metadata={metadata}
        onPrevPage={actions.prevPage}
        onNextPage={actions.nextPage}
        itemsPerPage={actions.itemsPerPage}
      />
    </>
  )
}
