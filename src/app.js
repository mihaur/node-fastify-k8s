import services from './services/index.js'

import * as config from './config.js'

export default async function (fastify, opts) {
  await fastify.register(import('@fastify/env'), config.envOptions)
  fastify.register(import('@fastify/mongodb'), {
    url: fastify.config.MONGODB_URI
  })

  fastify.register(services, { prefix: '/api' })

  return fastify
}
