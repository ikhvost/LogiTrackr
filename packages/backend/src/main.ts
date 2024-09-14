import { bootstrapper } from './core'

bootstrapper()
  .then(async (service) => {
    await service.start()

    process.on('SIGTERM', () => {
      void service.stop().then(() => process.exit(1))
    })
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exit(1)
  })
