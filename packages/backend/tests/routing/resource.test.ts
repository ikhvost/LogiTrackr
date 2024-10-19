import { beforeAll, afterEach, describe, expect, test } from 'vitest'
import { Builder, IBuilder } from 'builder-pattern'
import { ResourcePayload } from '@saas-versioning/contracts'

import { Testing } from '../testing'

import * as schema from '../../src/model/database'

export const ResourcePayloadBuilder = (): IBuilder<ResourcePayload> => Builder<ResourcePayload>()

describe('Integration: API /resources', () => {
  let testing: Testing

  beforeAll(async () => {
    testing = await Testing.setup()
  })

  afterEach(async () => {
    await testing.clean()
  })

  test('return 200 on creating a new resource successfully', async () => {
    const payload = ResourcePayloadBuilder().id('test-resource-id').type('test-type').data({ key: 'value' }).build()

    const response = await testing.request({
      method: 'POST',
      path: '/resources',
      payload,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ message: 'Resource updated' })

    const resources = await testing.db.select().from(schema.resources)
    const versions = await testing.db.select().from(schema.versions)

    expect(resources).toEqual([
      {
        id: expect.any(String),
        lastVersionId: versions[0].id,
        externalId: payload.id,
        type: payload.type,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ])

    expect(versions).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        resourceId: resources[0].id,
        data: payload.data,
        revision: 1,
      },
    ])
  })

  test('return 200 on updating an existing resource', async () => {
    const payload1 = ResourcePayloadBuilder().id('test-resource-id').type('test-type').data({ key: 'value' }).build()
    const payload2 = ResourcePayloadBuilder().id('test-resource-id').type('test-type').data({ updated: 'data' }).build()

    // Create initial resource
    await testing.request({
      method: 'POST',
      path: '/resources',
      payload: payload1,
    })

    const response = await testing.request({
      method: 'POST',
      path: '/resources',
      payload: payload2,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ message: 'Resource updated' })

    const resources = await testing.db.select().from(schema.resources)
    const versions = await testing.db.select().from(schema.versions)

    expect(resources).toEqual([
      {
        id: expect.any(String),
        lastVersionId: versions[1].id,
        externalId: payload1.id,
        type: payload1.type,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ])

    expect(versions).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        resourceId: resources[0].id,
        data: payload1.data,
        revision: 1,
      },
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        resourceId: resources[0].id,
        data: payload2.data,
        revision: 2,
      },
    ])
  })

  test('returns 400 for invalid payload', async () => {
    const payload = ResourcePayloadBuilder().id('test-resource-id').type('test-type').build()

    const response = await testing.request({
      method: 'POST',
      path: '/resources',
      payload,
    })

    expect(response.json()).toEqual({
      statusCode: 400,
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: "body must have required property 'data'",
    })
  })

  test('returns 413 for payload exceeding size limit', async () => {
    const payload = ResourcePayloadBuilder()
      .id('test-resource-id')
      .type('test-type')
      .data({ large: 'x'.repeat(1048577) }) // Exceeds 1MB limit
      .build()

    const response = await testing.request({
      method: 'POST',
      path: '/resources',
      payload,
    })

    expect(response.json()).toEqual({
      statusCode: 413,
      code: 'FST_ERR_CTP_BODY_TOO_LARGE',
      error: 'Payload Too Large',
      message: 'Request body is too large',
    })
  })
})
