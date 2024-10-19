import { Metadata } from '@saas-versioning/contracts'

interface Props {
  metadata: Metadata
  itemsPerPage: number
  onPrevPage: () => void
  onNextPage: () => void
}

export const Pagination = ({ metadata, onPrevPage, onNextPage, itemsPerPage }: Props) => {
  return (
    <div className="flex justify-between items-center mt-8">
      <p className="text-sm text-gray-500">
        Showing {Math.min(metadata.totalCount, itemsPerPage)} of {metadata.totalCount} entries
      </p>
      <div className="flex space-x-2 items-center">
        <button
          onClick={onPrevPage}
          disabled={metadata.currentPage === 1}
          className="text-gray-600 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
        >
          «
        </button>
        <div className="text-sm text-gray-600">
          Page {metadata.currentPage} of {metadata.totalPages}
        </div>
        <button
          onClick={onNextPage}
          disabled={metadata.currentPage === metadata.totalPages}
          className="text-gray-600 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
        >
          »
        </button>
      </div>
    </div>
  )
}
