import dotenv from 'dotenv'

import { makeDb } from '../src/data-access'
import log from '../src/log'

dotenv.config()
;(async function setupDb () {
  console.log('Preparando o banco de dados ...')

  // database collection will automatically be created if it does not exist
  // indexes will only be added if they don't exist
  const db = await makeDb()
  const usersResult = await db
    .collection('users')
    .createIndexes([
      { key: { hash: 1 }, name: 'hash_idx' },
    ])
  log.info({ msg: usersResult })

  const tokensResult = await db
    .collection('tokens')
    .createIndexes([
      { key: { hash: 1 }, name: 'hash_idx' },
    ])
  log.info({ msg: tokensResult })

  log.info({ msg: 'Preparação do banco de dados concluída...' })
  process.exit()
})()
