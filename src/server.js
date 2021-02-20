import app from './app.js'

const start = async () => {
  try {
    const fastify = await app({ logger: true })
    await fastify.ready()
    fastify.listen(fastify.config.PORT, '0.0.0.0', (err, address) => {
      if (err) console.log(err)
    })
  } catch (err) {
    console.error('Could not start API server', err)
    process.exit(1)
  }
}

start()
