import { interfaces } from 'inversify'
import { InjectOptions, LightMyRequestResponse } from 'fastify'

import { bootstrapper, Application } from '../src/core'

export class Testing {
  constructor(private readonly container: interfaces.Container) {}

  static setup = async () => {
    const service = await bootstrapper()

    return new Testing(service.container)
  }

  request(options: InjectOptions): Promise<LightMyRequestResponse> {
    const app = this.container.get<Application>(Application)

    return app.inject(options)
  }
}
