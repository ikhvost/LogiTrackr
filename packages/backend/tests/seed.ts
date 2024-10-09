import { faker } from '@faker-js/faker'
import { eq } from 'drizzle-orm'
import { Testing } from './testing'
import * as schema from '../src/model/database'

const seedDatabase = async (): Promise<void> => {
  const testing = await Testing.setup()
  const resourceTypes = ['article', 'image', 'video', 'document']
  const resourceCount = 30

  const resources = Array.from({ length: resourceCount }, () => {
    const type = faker.helpers.arrayElement(resourceTypes)

    return {
      id: faker.string.uuid(),
      externalId: type + '-' + faker.string.alphanumeric(5),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      type,
    }
  })

  const versions = resources
    .map((resource) => {
      const revisions = Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, index) => ({
        id: faker.string.uuid(),
        resourceId: resource.id,
        revision: index + 1,
        data: generateFakeData(resource.type as string),
        createdAt: faker.date.between({ from: resource.createdAt, to: resource.updatedAt }),
      }))
      return revisions
    })
    .flat()

  await testing.db.insert(schema.resources).values(resources)
  await testing.db.insert(schema.versions).values(versions)

  for (const version of versions) {
    await testing.db
      .update(schema.resources)
      .set({ lastVersionId: version.id })
      .where(eq(schema.resources.id, version.resourceId as string))
  }
}

function generateFakeData(type: string) {
  switch (type) {
    case 'article':
      return {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
        author: faker.person.fullName(),
      }
    case 'image':
      return {
        url: faker.image.url(),
        width: faker.number.int({ min: 100, max: 4000 }),
        height: faker.number.int({ min: 100, max: 4000 }),
      }
    case 'video':
      return {
        url: faker.internet.url(),
        duration: faker.number.int({ min: 30, max: 7200 }),
        resolution: faker.helpers.arrayElement(['720p', '1080p', '4K']),
      }
    case 'document':
      return {
        title: faker.lorem.words(),
        content: faker.lorem.paragraphs(),
        format: faker.helpers.arrayElement(['pdf', 'docx', 'txt']),
      }
    default:
      return {}
  }
}

seedDatabase()
  .then(() => console.log('Database seeded successfully!'))
  .catch((error) => console.error('Error seeding database:', error))
