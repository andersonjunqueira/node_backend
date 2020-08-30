const mongodb = require('mongodb');

const log = require('../log');
const makeUsersDb = require('./users-db');
const makeTokensDb = require('./tokens-db');

log.info(`[DB] Loading database config`);
const MongoClient = mongodb.MongoClient;
const url = process.env.ENV_DB_URL;
const dbName = process.env.ENV_DB_NAME;
const client = new MongoClient(url, { useNewUrlParser: true });

const makeDb = async () => {
  if (!client.isConnected()) {
  log.info(`[DB] Connecting to DB ${process.env.ENV_DB_NAME}`);
    await client.connect();
  }
  return client.db(dbName);
}

module.exports = Object.freeze({
  makeDb,
  usersDb: makeUsersDb({ makeDb }),
  tokensDb: makeTokensDb({ makeDb }),
});

