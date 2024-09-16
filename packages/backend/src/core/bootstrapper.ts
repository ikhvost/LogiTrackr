import { Container, BindingScopeEnum } from 'inversify'

import { emit, Hook } from './hooks'

import application from './application'
import database from './database'

export const bootstrapper = async () => {
  const container = new Container({
    defaultScope: BindingScopeEnum.Singleton,
    autoBindInjectable: true,
  })

  container.load(application)
  container.load(database)

  // emit Application bootstrap hook
  await emit(container, Hook.Bootstrap, true)

  return {
    container,
    start: async () => emit(container, Hook.Start, true),
    stop: async () => emit(container, Hook.Stop, true),
  }
}
