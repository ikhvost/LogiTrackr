import { useState, useEffect } from 'react'
import { Metadata, Paginated, Version } from '@logitrackr/contracts'
import { fetcher } from '../utils'

export function useRevisions(id: string, page: number, pageSize: number) {
  const [revisions, setRevisions] = useState<Version[] | null>(null)
  const [metadata, setMetadata] = useState<Metadata>({ totalCount: 0, totalPages: 0, currentPage: 1 })
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadRevisions = async () => {
      setError(null)
      try {
        const response = await fetcher.get<Paginated<Version>>(`/resources/${id}/versions`, {
          page,
          size: pageSize,
        })
        setRevisions(response.data)
        setMetadata(response.metadata)
      } catch (err) {
        console.error('Error fetching revisions:', err)
        setError(err instanceof Error ? err : new Error('An error occurred while fetching data'))
        setRevisions(null)
      }
    }

    loadRevisions().catch(console.error)
  }, [id, page, pageSize])

  return { revisions, metadata, error }
}
