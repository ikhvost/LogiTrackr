import { useState, useEffect } from 'react'
import { Metadata, Paginated, SearchResponse as Record } from '@logitrackr/contracts'
import { fetcher } from '../utils'

export function useSearch(query: string, page: number, pageSize: number) {
  const [records, setRecords] = useState<Record[] | null>(null)
  const [metadata, setMetadata] = useState<Metadata>({ totalCount: 0, totalPages: 0, currentPage: 1 })
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setError(null)
      try {
        const response = await fetcher.get<Paginated<Record>>('/search', { q: query, page, size: pageSize })
        setRecords(response.data)
        setMetadata(response.metadata)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err : new Error('An error occurred while fetching data'))
        setRecords(null)
      }
    }

    loadData().catch(console.error)
  }, [query, page, pageSize])

  return { records, metadata, error }
}
