import { ErrorObject } from 'ajv'

export class InvalidConfigError extends Error {
  errors: ErrorObject[]

  constructor(errors: ErrorObject[]) {
    super('Data does not match validation schema')

    this.errors = errors
  }
}
