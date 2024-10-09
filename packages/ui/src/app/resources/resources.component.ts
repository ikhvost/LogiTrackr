import { Component } from '@angular/core'

import { Resource, ResourceService } from '../core/services/resource.service'

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
})
export class ResourcesComponent {
  resources: Resource[] = []
  totalCount: number = 0
  page: number = 1
  pageSize: number = 10

  constructor(private resourceService: ResourceService) {}

  ngOnInit() {
    this.loadResources()
  }

  loadResources(query: string = '', page: number = 1, pageSize: number = 10) {
    this.resourceService.search(query, page, pageSize).subscribe((results) => {
      this.resources = results.resources
      this.totalCount = results.totalCount
      this.page = page
      this.pageSize = pageSize
    })
  }

  onPageChange(event: any) {
    this.page = event.page
    this.pageSize = event.pageSize
    this.loadResources()
  }

  onSearch(query: string) {
    this.loadResources(query)
  }
}
