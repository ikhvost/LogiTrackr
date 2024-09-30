import { beforeAll, afterEach, describe, expect, test } from 'vitest'
import { Builder, IBuilder } from 'builder-pattern'

import { Testing } from '../testing'
import { ResourcePayload } from '../../src/routing/resource'

import * as schema from '../../src/model/database'

export const ResourcePayloadBuilder = (): IBuilder<ResourcePayload> => Builder<ResourcePayload>()

describe('Integration: API /resources/:resourceId/versions', () => {
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

    await Promise.all([
      testing.request({ method: 'POST', path: '/resources', payload: payload1 }),
      testing.request({ method: 'POST', path: '/resources', payload: payload2 }),
    ])

    const [resource] = await testing.db.select().from(schema.resources).limit(1)
    const response = await testing.request({
      method: 'GET',
      path: `/resources/${resource.id}/versions`,
    })

    expect(response.statusCode).toEqual(200)
    expect(response.json()).toEqual({
      versions: [
        {
          createdAt: expect.any(String),
          id: expect.any(String),
          data: { version: 2 },
        },
        {
          createdAt: expect.any(String),
          id: expect.any(String),
          data: { version: 1 },
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
      versions: [
        {
          data: { version: 15 },
          createdAt: expect.any(String),
          id: expect.any(String),
        },
        {
          data: { version: 14 },
          createdAt: expect.any(String),
          id: expect.any(String),
        },
        {
          data: { version: 13 },
          createdAt: expect.any(String),
          id: expect.any(String),
        },
        {
          data: { version: 12 },
          createdAt: expect.any(String),
          id: expect.any(String),
        },
        {
          data: { version: 11 },
          createdAt: expect.any(String),
          id: expect.any(String),
        },
        {
          data: { version: 10 },
          createdAt: expect.any(String),
          id: expect.any(String),
        },
        {
          data: { version: 9 },
          createdAt: expect.any(String),
          id: expect.any(String),
        },
        {
          data: { version: 8 },
          createdAt: expect.any(String),
          id: expect.any(String),
        },
        {
          data: { version: 7 },
          createdAt: expect.any(String),
          id: expect.any(String),
        },
        {
          data: { version: 6 },
          createdAt: expect.any(String),
          id: expect.any(String),
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
      versions: [],
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
      message: 'params/resourceId must match format "uuid"',
      statusCode: 400,
    })
  })
})
