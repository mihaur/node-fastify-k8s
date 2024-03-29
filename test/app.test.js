import tap from 'tap'
import { buildFastify } from './helper.js'

const { test } = tap

test('GET `/api/ping` route', async t => {
  const fastify = await buildFastify(t)

  const res = await fastify.inject({
    method: 'GET',
    url: '/api/ping'
  })
  t.equal(res.headers['content-type'], 'application/json; charset=utf-8')
  t.equal(res.statusCode, 200)
  t.same(res.json(), { ping: 'pong' })
  const result = await fastify.mongo.db.collection('access-log').find({}).limit(1).project({ _id: 0, ping: 1 }).sort({ $natural: -1 }).toArray()
  t.same(result[0], { ping: 'pong' })
})

test('GET `/api/ping?delay=1` route', async t => {
  const fastify = await buildFastify(t)

  const res = await fastify.inject({
    method: 'GET',
    url: '/api/ping?delay=1'
  })
  t.equal(res.headers['content-type'], 'application/json; charset=utf-8')
  t.equal(res.statusCode, 200)
  t.same(res.json(), { ping: 'pong' })
  const result = await fastify.mongo.db.collection('access-log').find({}).limit(1).project({ _id: 0, ping: 1 }).sort({ $natural: -1 }).toArray()
  t.same(result[0], { ping: 'pong' })
})

test('GET `/api/ping?delay=A` route', async t => {
  const fastify = await buildFastify(t)

  const res = await fastify.inject({
    method: 'GET',
    url: '/api/ping?delay=A'
  })
  t.equal(res.headers['content-type'], 'application/json; charset=utf-8')
  t.equal(res.statusCode, 400)
  t.equal(res.statusMessage, 'Bad Request')
})

test('GET `/api/ping/bang` route', async t => {
  const fastify = await buildFastify(t)

  const res = await fastify.inject({
    method: 'GET',
    url: '/api/ping/bang'
  })
  t.equal(res.headers['content-type'], 'application/json; charset=utf-8')
  t.equal(res.statusCode, 200)
  t.same(res.json(), { ping: 'bang' })
  const result = await fastify.mongo.db.collection('access-log').find({}).limit(1).project({ _id: 0, ping: 1 }).sort({ $natural: -1 }).toArray()
  t.same(result[0], { ping: 'bang' })
})

test('GET `/api/ping/bang?delay=1` route', async t => {
  const fastify = await buildFastify(t)

  const res = await fastify.inject({
    method: 'GET',
    url: '/api/ping/bang?delay=1'
  })
  t.equal(res.headers['content-type'], 'application/json; charset=utf-8')
  t.equal(res.statusCode, 200)
  t.same(res.json(), { ping: 'bang' })
  const result = await fastify.mongo.db.collection('access-log').find({}).limit(1).project({ _id: 0, ping: 1 }).sort({ $natural: -1 }).toArray()
  t.same(result[0], { ping: 'bang' })
})
