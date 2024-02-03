import { compositeRoot } from './container'
import { emit, Hook } from './hooks'

export const bootstrapper = async () => {
  const container = compositeRoot()

  // emit Application bootstrap hook
  await emit(container, Hook.Bootstrap, true)

  return {
    container,
    start: async () => emit(container, Hook.Start, true),
    stop:  async () => emit(container, Hook.Stop, true),
  }
}
