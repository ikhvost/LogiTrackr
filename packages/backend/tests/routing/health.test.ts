import { beforeAll, describe, expect, test } from 'vitest'
import { Testing } from '../testing'

describe('Integration: API /health', () => {
  let testing: Testing

  beforeAll(async () => {
    testing = await Testing.setup()
  })

  test('returns 200 HTTP', async () => {
    const response = await testing.request({
      path: '/health',
    })

    expect(response.statusCode).toEqual(200)
  })
})
