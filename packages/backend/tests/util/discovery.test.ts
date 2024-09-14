import { describe, expect, test, beforeAll } from 'vitest'
import { JSONSchemaType } from 'ajv'

import { ConfigDiscovery } from '../../src/util/discovery'

type ConfigSchema = {
  foo: string
  nested: {
    foo: string
  }
}

const schema: JSONSchemaType<ConfigSchema> & { properties: object } = {
  additionalProperties: true,
  type: 'object',
  required: ['foo', 'nested'],
  properties: {
    foo: {
      type: 'string',
    },
    nested: {
      type: 'object',
      required: ['foo'],
      properties: {
        foo: {
          type: 'string',
        },
      },
    },
  },
}

describe('Unit: ConfigDiscovery', () => {
  let configDiscovery: ConfigDiscovery

  beforeAll(() => {
    configDiscovery = new ConfigDiscovery()
  })

  test('discover and marshall envs directly from process ', () => {
    const source = {
      FOOBAR__FOO: 'foo1',
      FOOBAR__NESTED__FOO: 'bar2',
    } as unknown as typeof process.env

    expect(configDiscovery.discover(schema, 'FOOBAR', source)).toEqual({
      foo: 'foo1',
      nested: {
        foo: 'bar2',
      },
    })
  })

  test('discover only process env that contains service prefix', () => {
    const source = {
      FOO_FOO: 'incorrect',
      BAR_BAR: 'bar',
      FOOBAR__FOO: 'foo1',
      FOOBAR__NESTED__FOO: 'bar2',
    } as unknown as typeof process.env

    expect(configDiscovery.discover(schema, 'FOOBAR', source)).toEqual({
      foo: 'foo1',
      nested: {
        foo: 'bar2',
      },
    })
  })

  test('returns only properties defined in schema (reject additional properties)', () => {
    const source = {
      FOOBAR__FOO: 'baz',
      FOOBAR__NESTED__FOO: 'bar2',
    } as unknown as typeof process.env

    expect(configDiscovery.discover(schema, 'FOOBAR', source)).toEqual({
      foo: 'baz',
      nested: {
        foo: 'bar2',
      },
    })
  })

  test('throws an error for invalid config', () => {
    const source = {
      FOOBAR__FOO: 'baz',
    } as unknown as typeof process.env

    expect(() => configDiscovery.discover(schema, 'FOOBAR', source)).toThrowError()
  })
})
