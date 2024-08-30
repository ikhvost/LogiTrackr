import { Container, BindingScopeEnum } from 'inversify'

import application from './application'
import database from './database'
import config from './config'

export const compositeRoot = () => {
  const container = new Container({
    defaultScope: BindingScopeEnum.Singleton,
    autoBindInjectable: true,
  })

  container.load(config)
  container.load(database)
  container.load(application)

  return container
}
