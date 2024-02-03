import { interfaces } from 'inversify'

export enum Hook {
  /** Runs on container boot */
  Bootstrap = 'Hook.Bootstrap',

  /** Runs on container start */
  Start = 'Hook.Start',

  /** Runs on container stop */
  Stop = 'Hook.Stop',
}

export interface HookFn {
  (container: interfaces.Container): Promise<unknown> | unknown

  priority?: number
}

export function withPriority(priority: number, fn: HookFn): HookFn {
  fn.priority = priority

  return fn
}

export async function emit(container: interfaces.Container, hook: Hook, once = true): Promise<interfaces.Container> {
  const hookInvokedKey = `${hook}.Invoked`

  if (once && container.isBound(hookInvokedKey)) {
    return container
  }

  if (container.isBound(hook)) {
    const functions = container.getAll<HookFn>(hook).sort((a, b) => {
      // Use nullish coalescing operator to provide a default value of 0 for priority
      const priorityA = a.priority ?? 0
      const priorityB = b.priority ?? 0

      // Return negative value if b's priority is higher to sort in descending order
      return priorityB - priorityA
    })

    for (const fn of functions) {
      await fn(container)
    }
  }

  if (!container.isBound(hookInvokedKey)) {
    container.bind(hookInvokedKey).toConstantValue(true)
  }

  return container
}
