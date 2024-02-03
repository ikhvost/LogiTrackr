import * as R from 'ramda'
import Ajv, { JSONSchemaType } from 'ajv'
import { camelCase } from 'camel-case'

import { InvalidConfigError } from '../model'

export class ConfigDiscovery {
  static #Delimiter = '__'

  #ajv: Ajv

  constructor() {
    this.#ajv = new Ajv({
      allErrors:   true,
      useDefaults: true,
      coerceTypes: true,
    })
  }

  discover<T = unknown>(schema: JSONSchemaType<T> & { properties: object }, prefix: string, source = process.env) {
    let config = {}

    for (const [key, value] of Object.entries(source)) {
      if (!key.startsWith(prefix)) {
        continue
      }

      const path = key
        .substring(prefix.length)
        .split(ConfigDiscovery.#Delimiter)
        .filter(part => !R.isEmpty(part))
        .map(part => camelCase(part))

      config = R.mergeDeepLeft(R.assocPath(path, value, config), config)
    }

    const valid = this.#ajv.validate(schema, config)

    if (!valid) {
      throw new InvalidConfigError(this.#ajv.errors!)
    }

    return R.pickAll(Object.keys(schema.properties))(config)
  }
}
