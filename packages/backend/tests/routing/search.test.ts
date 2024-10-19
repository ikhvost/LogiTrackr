import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { eq } from 'drizzle-orm'
import * as schema from '../../src/model/database'
import { Testing } from '../testing'

describe('Integration: API /search', () => {
  let testing: Testing

  const resources = [
    {
      id: '995e3ff4-eb97-4599-b0e7-0d27dd7bc54a',
      externalId: 'ext1',
      type: 'type1',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    },
    {
      id: '974402b1-ebaf-41b0-8574-f63a97964fc0',
      externalId: 'ext2',
      type: 'type2',
      createdAt: new Date('2023-01-03'),
      updatedAt: new Date('2023-01-04'),
    },
    {
      id: '7493625a-4f56-4a77-956d-5e7916abf651',
      externalId: 'ext3',
      type: 'type1',
      createdAt: new Date('2023-01-05'),
      updatedAt: new Date('2023-01-06'),
    },
    {
      id: '93327052-6ea5-4882-8b3d-a68174824bbe',
      externalId: 'special',
      type: 'type3',
      createdAt: new Date('2023-01-07'),
      updatedAt: new Date('2023-01-08'),
    },
    {
      id: 'bf292643-c4d6-4792-b2a9-9c812e667800',
      externalId: 'ext5',
      type: 'special',
      createdAt: new Date('2023-01-09'),
      updatedAt: new Date('2023-01-10'),
    },
  ]

  const versions = [
    {
      id: 'dd6168c0-fbb8-498a-83be-3a9eb26dc521',
      resourceId: '995e3ff4-eb97-4599-b0e7-0d27dd7bc54a',
      revision: 1,
      data: { foo: 'bar' },
      createdAt: new Date('2023-01-02'),
    },
    {
      id: '8a89424a-b83c-4379-bb93-b5b4a3edc005',
      resourceId: '974402b1-ebaf-41b0-8574-f63a97964fc0',
      revision: 2,
      data: { baz: 'qux' },
      createdAt: new Date('2023-01-04'),
    },
    {
      id: '73d1782c-549a-4ee5-a93f-184057a3bdc3',
      resourceId: '7493625a-4f56-4a77-956d-5e7916abf651',
      revision: 6,
      data: { quux: 'corge' },
      createdAt: new Date('2023-01-06'),
    },
    {
      id: '45326081-1867-408e-90f4-e9273a5e7cbb',
      resourceId: '93327052-6ea5-4882-8b3d-a68174824bbe',
      revision: 4,
      data: { grault: 'garply' },
      createdAt: new Date('2023-01-08'),
    },
    {
      id: 'f4ebbbd0-6d86-4f01-9570-4ac474165717',
      resourceId: 'bf292643-c4d6-4792-b2a9-9c812e667800',
      revision: 10,
      data: { waldo: 'fred' },
      createdAt: new Date('2023-01-10'),
    },
  ]

  beforeAll(async () => {
    testing = await Testing.setup()

    await testing.db.insert(schema.resources).values(resources)
    await testing.db.insert(schema.versions).values(versions)

    // Set the lastVersionId for each resource
    for (const version of versions) {
      const resource = resources.find((resource) => resource.id === version.resourceId)!

      await testing.db
        .update(schema.resources)
        .set({ lastVersionId: version.id })
        .where(eq(schema.resources.id, resource.id))
    }
  })

  afterAll(async () => {
    await testing.clean()
  })

  it('should return all resources when no search query is provided', async () => {
    const response = await testing.request({
      method: 'GET',
      url: '/search?page=1&size=10',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.json()).toEqual({
      data: [
        {
          id: 'bf292643-c4d6-4792-b2a9-9c812e667800',
          externalId: 'ext5',
          type: 'special',
          createdAt: '2023-01-09T00:00:00.000Z',
          updatedAt: expect.any(String),
          lastVersion: {
            id: 'f4ebbbd0-6d86-4f01-9570-4ac474165717',
            createdAt: '2023-01-10T00:00:00.000Z',
            revision: 10,
            data: {
              waldo: 'fred',
            },
          },
        },
        {
          id: '93327052-6ea5-4882-8b3d-a68174824bbe',
          externalId: 'special',
          type: 'type3',
          createdAt: '2023-01-07T00:00:00.000Z',
          updatedAt: expect.any(String),
          lastVersion: {
            id: '45326081-1867-408e-90f4-e9273a5e7cbb',
            createdAt: '2023-01-08T00:00:00.000Z',
            revision: 4,
            data: {
              grault: 'garply',
            },
          },
        },
        {
          id: '7493625a-4f56-4a77-956d-5e7916abf651',
          externalId: 'ext3',
          type: 'type1',
          createdAt: '2023-01-05T00:00:00.000Z',
          updatedAt: expect.any(String),
          lastVersion: {
            id: '73d1782c-549a-4ee5-a93f-184057a3bdc3',
            createdAt: '2023-01-06T00:00:00.000Z',
            revision: 6,
            data: {
              quux: 'corge',
            },
          },
        },
        {
          id: '974402b1-ebaf-41b0-8574-f63a97964fc0',
          externalId: 'ext2',
          type: 'type2',
          createdAt: '2023-01-03T00:00:00.000Z',
          updatedAt: expect.any(String),
          lastVersion: {
            id: '8a89424a-b83c-4379-bb93-b5b4a3edc005',
            createdAt: '2023-01-04T00:00:00.000Z',
            revision: 2,
            data: {
              baz: 'qux',
            },
          },
        },
        {
          id: '995e3ff4-eb97-4599-b0e7-0d27dd7bc54a',
          externalId: 'ext1',
          type: 'type1',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: expect.any(String),
          lastVersion: {
            id: 'dd6168c0-fbb8-498a-83be-3a9eb26dc521',
            createdAt: '2023-01-02T00:00:00.000Z',
            revision: 1,
            data: {
              foo: 'bar',
            },
          },
        },
      ],
      metadata: {
        totalCount: 5,
        currentPage: 1,
        totalPages: 1,
      },
    })
  })

  it('should return filtered results when searching by externalId', async () => {
    const response = await testing.request({
      method: 'GET',
      url: '/search?q=ext2&page=1&size=10',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.json()).toEqual({
      data: [
        {
          id: '974402b1-ebaf-41b0-8574-f63a97964fc0',
          externalId: 'ext2',
          type: 'type2',
          createdAt: '2023-01-03T00:00:00.000Z',
          updatedAt: expect.any(String),
          lastVersion: {
            id: '8a89424a-b83c-4379-bb93-b5b4a3edc005',
            createdAt: '2023-01-04T00:00:00.000Z',
            revision: 2,
            data: {
              baz: 'qux',
            },
          },
        },
      ],
      metadata: {
        totalCount: 1,
        currentPage: 1,
        totalPages: 1,
      },
    })
  })

  it('should return filtered results when searching by type', async () => {
    const response = await testing.request({
      method: 'GET',
      url: '/search?q=type1&page=1&size=10',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.json()).toEqual({
      data: [
        {
          id: '7493625a-4f56-4a77-956d-5e7916abf651',
          externalId: 'ext3',
          type: 'type1',
          createdAt: '2023-01-05T00:00:00.000Z',
          updatedAt: expect.any(String),
          lastVersion: {
            id: '73d1782c-549a-4ee5-a93f-184057a3bdc3',
            createdAt: '2023-01-06T00:00:00.000Z',
            revision: 6,
            data: {
              quux: 'corge',
            },
          },
        },
        {
          id: '995e3ff4-eb97-4599-b0e7-0d27dd7bc54a',
          externalId: 'ext1',
          type: 'type1',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: expect.any(String),
          lastVersion: {
            id: 'dd6168c0-fbb8-498a-83be-3a9eb26dc521',
            createdAt: '2023-01-02T00:00:00.000Z',
            revision: 1,
            data: {
              foo: 'bar',
            },
          },
        },
      ],
      metadata: {
        totalCount: 2,
        currentPage: 1,
        totalPages: 1,
      },
    })
  })

  it('should handle partial matches in externalId and type', async () => {
    const response = await testing.request({
      method: 'GET',
      url: '/search?q=special&page=1&size=10',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.json()).toEqual({
      data: [
        {
          id: 'bf292643-c4d6-4792-b2a9-9c812e667800',
          externalId: 'ext5',
          type: 'special',
          createdAt: '2023-01-09T00:00:00.000Z',
          updatedAt: expect.any(String),
          lastVersion: {
            id: 'f4ebbbd0-6d86-4f01-9570-4ac474165717',
            createdAt: '2023-01-10T00:00:00.000Z',
            revision: 10,
            data: {
              waldo: 'fred',
            },
          },
        },
        {
          id: '93327052-6ea5-4882-8b3d-a68174824bbe',
          externalId: 'special',
          type: 'type3',
          createdAt: '2023-01-07T00:00:00.000Z',
          updatedAt: expect.any(String),
          lastVersion: {
            id: '45326081-1867-408e-90f4-e9273a5e7cbb',
            createdAt: '2023-01-08T00:00:00.000Z',
            revision: 4,
            data: {
              grault: 'garply',
            },
          },
        },
      ],
      metadata: {
        totalCount: 2,
        currentPage: 1,
        totalPages: 1,
      },
    })
  })

  it('should return empty results for non-existent search term', async () => {
    const response = await testing.request({
      method: 'GET',
      url: '/search?q=nonexistent&page=1&size=10',
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

  it('should handle pagination correctly', async () => {
    const response1 = await testing.request({
      method: 'GET',
      url: '/search?page=1&size=2',
    })

    const response2 = await testing.request({
      method: 'GET',
      url: '/search?page=2&size=2',
    })

    const response3 = await testing.request({
      method: 'GET',
      url: '/search?page=3&size=2',
    })

    const body1 = response1.json()
    const body2 = response2.json()
    const body3 = response3.json()

    expect(body1.data).toHaveLength(2)
    expect(body2.data).toHaveLength(2)
    expect(body3.data).toHaveLength(1)

    expect(body1.metadata.currentPage).toEqual(1)
    expect(body2.metadata.currentPage).toEqual(2)
    expect(body3.metadata.currentPage).toEqual(3)
  })
})
