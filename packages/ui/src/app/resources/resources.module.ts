import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { CardModule } from 'primeng/card'

import { ResourcesRoutingModule } from './resources-routing.module'
import { ResourcesComponent } from './resources.component'
import { ResourcesSearchComponent } from './components/resources-search/resources-search.component'
import { ResourcesTableComponent } from './components/resources-table/resources-table.component'

@NgModule({
  declarations: [ResourcesComponent, ResourcesSearchComponent, ResourcesTableComponent],
  imports: [CommonModule, ResourcesRoutingModule, FormsModule, TableModule, ButtonModule, InputTextModule, CardModule],
})
export class ResourcesModule {}
