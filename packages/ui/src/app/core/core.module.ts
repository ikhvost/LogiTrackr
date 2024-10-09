import { NgModule, Optional, SkipSelf } from '@angular/core'

import { ResourceService } from './services/resource.service'

@NgModule({
  providers: [ResourceService],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule.')
    }
  }
}
