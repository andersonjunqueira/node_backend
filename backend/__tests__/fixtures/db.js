import mongodb from 'mongodb'

import log from './log'

const MongoClient = mongodb.MongoClient

let connection, db

export const makeDb = async () => {
  // log.test( { msg: `MongoDB test server: ${global.__MONGO_URI__}` })
  connection =
    connection ||
    (await MongoClient.connect(
      global.__MONGO_URI__,
      { useNewUrlParser: true }
    ))
  db = db || (await connection.db(global.__MONGO_DB_NAME__))
  return db
}

export const closeDb = async () => {
  await connection.close()
  await db.close()
}

export const clearDb = async () => {
  await db.collection('users').deleteMany({})
  await db.collection('tokens').deleteMany({})
  return true
}

export { connection, db }
export default makeDb