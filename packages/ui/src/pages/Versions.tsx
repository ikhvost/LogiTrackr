import React from 'react'
import { useParams } from 'react-router-dom'
import { Version } from '@logitrackr/contracts'
import { Table, Pagination, Diff, BackButton } from '../components'
import { useRevisions } from '../hooks/useRevisions'

interface Props {
  externalId?: string
}

export const Versions: React.FC<Props> = ({ externalId }) => {
  const columns = React.useMemo(
    () => [
      { header: 'ID', accessor: 'id' as keyof Version },
      {
        header: 'Created At',
        accessor: 'createdAt' as keyof Version,
        render: (revision: Version) => new Date(revision.createdAt).toLocaleString('en-US', { timeZone: 'UTC' }),
      },
      { header: 'Revision', accessor: 'revision' as keyof Version },
    ],
    [],
  )

  const actions = {
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
    itemsPerPage: 10,
  }

  const { id } = useParams<{ id: string }>()
  const [page, setPage] = React.useState(1)
  const { revisions, metadata, error } = useRevisions(id!, page, actions.itemsPerPage)

  const renderExpandedRow = (revision: Version) => {
    const currentIndex = revisions?.findIndex((r) => r.id === revision.id) ?? -1
    const previousRevision = currentIndex < revisions!.length - 1 ? revisions![currentIndex + 1] : null

    return (
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold mb-4">Data Comparison for Revision {revision.revision}</h3>
        {previousRevision ? (
          <Diff oldData={previousRevision.data} currentData={revision.data} />
        ) : (
          <p className="text-gray-600 italic">No previous version to compare.</p>
        )}
      </div>
    )
  }

  if (error) return <div className="text-red-600">Error: {error.message}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Resource Revisions</h1>
            {externalId && <p className="text-blue-100">External ID: {externalId}</p>}
          </div>
          <BackButton />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table<Version> data={revisions || []} columns={columns} renderExpandedRow={renderExpandedRow} />
      </div>
      <Pagination
        metadata={metadata}
        onPrevPage={actions.prevPage}
        onNextPage={actions.nextPage}
        itemsPerPage={actions.itemsPerPage}
      />
    </div>
  )
}
