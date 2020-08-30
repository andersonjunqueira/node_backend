const dotenv = require('dotenv');

const { makeDb } = require('../src/data-access');
const log = require('../src/log');

dotenv.config();

;(async () => {
  log.info(`[TESTDB] Preparing the DB ...`);
  // database collection will automatically be created if it does not exist indexes will only be added if they don't exist

  log.info(`[TESTDB] Creating users collection ...`);
  const db = await makeDb();
  const usersResult = await db
    .collection('users')
    .createIndexes([
      { key: { hash: 1 }, name: 'hash_idx' },
    ]);
  log.info({ msg: usersResult });

  log.info(`[TESTDB] Creating tokens collection ...`);
  const tokensResult = await db
    .collection('tokens')
    .createIndexes([
      { key: { hash: 1 }, name: 'hash_idx' },
    ]);
  log.info({ msg: tokensResult });
  
  log.info(`[TESTDB] DB created.`);
  process.exit();
})()
