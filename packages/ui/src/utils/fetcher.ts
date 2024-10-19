export type Headers = Record<string, string>
export type Serialized = Record<string, unknown>

export class ApiFetcher {
  #baseUrl: string

  constructor(api: string) {
    this.#baseUrl = api
  }

  async get<ResponseGeneric>(path: string, params = {}): Promise<ResponseGeneric> {
    const url = new URL(path, this.#baseUrl)
    url.search = new URLSearchParams(params).toString()
    const response = await fetch(url.toString())
    return this.handleResponse<ResponseGeneric>(response)
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json() as T
  }
}

export const fetcher = new ApiFetcher(import.meta.env.VITE_API_BASE_URL)
