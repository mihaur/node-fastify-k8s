export async function logAccess (document, logger, collection) {
  const result = { ...document, createdAt: new Date() }
  logger.info(result)
  await collection.insertOne(result, { w: 1 })
  return result
}
