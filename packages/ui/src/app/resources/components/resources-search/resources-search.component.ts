import { Component, EventEmitter, Output } from '@angular/core'

@Component({
  selector: 'app-resources-search',
  templateUrl: './resources-search.component.html',
})
export class ResourcesSearchComponent {
  query: string = ''

  @Output() search: EventEmitter<string> = new EventEmitter<string>()

  onSearch() {
    this.search.emit(this.query)
  }
}
