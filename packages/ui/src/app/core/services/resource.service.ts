import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
// import { environment } from '@env/environment'

export interface Resource {
  id: string
  externalId: string
  type: string
  createdAt: Date
  updatedAt: Date
  lastVersion: {
    id: string
    createdAt: Date
    revision: number
    data: any
  }
}

export interface SearchResponse {
  resources: Resource[]
  totalCount: number
}

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  private baseUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) {}

  search(query: string, page: number = 1, size: number = 20): Observable<SearchResponse> {
    const params = new HttpParams().set('q', query).set('page', page.toString()).set('size', size.toString())

    return this.http.get<SearchResponse>(`${this.baseUrl}/search`, { params })
  }
}
