import { beforeAll, afterEach, describe, expect, test } from 'vitest'
import { Builder, IBuilder } from 'builder-pattern'
import { ResourcePayload } from '@logitrackr/contracts'

import { Testing } from '../testing'

import * as schema from '../../src/model/database'

export const ResourcePayloadBuilder = (): IBuilder<ResourcePayload> => Builder<ResourcePayload>()

describe('Integration: API /resources/:id/versions', () => {
  let testing: Testing

  beforeAll(async () => {
    testing = await Testing.setup()
  })

  afterEach(async () => {
    await testing.clean()
  })

  test('return 200 and correct versions for a resource', async () => {
    const payload1 = ResourcePayloadBuilder().id('test-resource-id').type('test-type').data({ version: 1 }).build()
    const payload2 = ResourcePayloadBuilder().id('test-resource-id').type('test-type').data({ version: 2 }).build()

    await testing.request({ method: 'POST', path: '/resources', payload: payload1 })
    await testing.request({ method: 'POST', path: '/resources', payload: payload2 })

    const [resource] = await testing.db.select().from(schema.resources).limit(1)
    const response = await testing.request({
      method: 'GET',
      path: `/resources/${resource.id}/versions`,
    })

    expect(response.statusCode).toEqual(200)
    expect(response.json()).toEqual({
      data: [
        {
          createdAt: expect.any(String),
          id: expect.any(String),
          data: { version: 2 },
          revision: 2,
        },
        {
          createdAt: expect.any(String),
          id: expect.any(String),
          data: { version: 1 },
          revision: 1,
        },
      ],
      metadata: {
        totalCount: 2,
        currentPage: 1,
        totalPages: 1,
      },
    })
  })

  test('return 200 and correct pagination for multiple versions', async () => {
    const payload = ResourcePayloadBuilder().id('test-resource-id').type('test-type').data({}).build()

    // Create 25 versions
    for (let i = 1; i <= 25; i++) {
      await testing.request({
        method: 'POST',
        path: '/resources',
        payload: { ...payload, data: { version: i } },
      })
    }

    const [resource] = await testing.db.select().from(schema.resources).limit(1)
    const response = await testing.request({
      method: 'GET',
      path: `/resources/${resource.id}/versions?page=2&size=10`,
    })

    expect(response.statusCode).toEqual(200)
    expect(response.json()).toEqual({
      metadata: {
        currentPage: 2,
        totalCount: 25,
        totalPages: 3,
      },
      data: [
        {
          data: { version: 15 },
          createdAt: expect.any(String),
          id: expect.any(String),
          revision: 15,
        },
        {
          data: { version: 14 },
          createdAt: expect.any(String),
          id: expect.any(String),
          revision: 14,
        },
        {
          data: { version: 13 },
          createdAt: expect.any(String),
          id: expect.any(String),
          revision: 13,
        },
        {
          data: { version: 12 },
          createdAt: expect.any(String),
          id: expect.any(String),
          revision: 12,
        },
        {
          data: { version: 11 },
          createdAt: expect.any(String),
          id: expect.any(String),
          revision: 11,
        },
        {
          data: { version: 10 },
          createdAt: expect.any(String),
          id: expect.any(String),
          revision: 10,
        },
        {
          data: { version: 9 },
          createdAt: expect.any(String),
          id: expect.any(String),
          revision: 9,
        },
        {
          data: { version: 8 },
          createdAt: expect.any(String),
          id: expect.any(String),
          revision: 8,
        },
        {
          data: { version: 7 },
          createdAt: expect.any(String),
          id: expect.any(String),
          revision: 7,
        },
        {
          data: { version: 6 },
          createdAt: expect.any(String),
          id: expect.any(String),
          revision: 6,
        },
      ],
    })
  })

  test('return 200 and empty list for non-existent resourceId', async () => {
    const response = await testing.request({
      method: 'GET',
      path: '/resources/00000000-0000-0000-0000-000000000000/versions',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.json()).toEqual({
      data: [],
      metadata: {
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
      },
    })
  })

  test('return 400 for invalid resourceId', async () => {
    const response = await testing.request({
      method: 'GET',
      path: '/resources/invalid-uuid/versions',
    })

    expect(response.statusCode).toEqual(400)
    expect(response.json()).toEqual({
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: 'params/id must match format "uuid"',
      statusCode: 400,
    })
  })
})
