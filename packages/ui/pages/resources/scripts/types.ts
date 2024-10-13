export interface Resource {
  id: string
  type: string
  updatedAt: string
  lastVersion: {
    revision: string
  }
}

export interface Metadata {
  totalCount: number
  totalPages: number
  currentPage: number
}

export interface ApiResponse {
  resources: Resource[]
  metadata: Metadata
}
