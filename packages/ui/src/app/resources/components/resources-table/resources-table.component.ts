import { Component, Input, SimpleChanges } from '@angular/core'

import { Resource } from '../../../core/services/resource.service'

@Component({
  selector: 'app-resources-table',
  templateUrl: './resources-table.component.html',
})
export class ResourcesTableComponent {
  @Input() resources: Resource[] = []
  @Input() totalCount: number = 0
  @Input() page: number = 1
  @Input() pageSize: number = 20

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resources']) {
      this.page = 1 // Reset to first page on data change
    }
  }

  onPageChange(event: any) {
    this.page = event.page
    this.pageSize = event.pageSize
  }
}
