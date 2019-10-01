import mongodb from 'mongodb'

import makeUsersDb from './users-db'
import makeTokensDb from './tokens-db'

const MongoClient = mongodb.MongoClient
const url = process.env.MD_DB_URL
const dbName = process.env.MD_DB_NAME
const client = new MongoClient(url, { useNewUrlParser: true })

export async function makeDb () {
  if (!client.isConnected()) {
    await client.connect()
  }
  return client.db(dbName)
}

export const usersDb = makeUsersDb({ makeDb })
export const tokensDb = makeTokensDb({ makeDb })
