const mongodb = require('mongodb');

const log = require('../../src/log');

const MongoClient = mongodb.MongoClient;

let connection, db;

const makeDb = async () => {
  // log.test( { msg: `MongoDB test server: ${global.__MONGO_URI__}` })
  connection =
    connection ||
    (await MongoClient.connect(
      global.__MONGO_URI__,
      { useNewUrlParser: true }
    ));
  db = db || (await connection.db(global.__MONGO_DB_NAME__));
  return db;
};

const closeDb = async () => {
  await connection.close();
  await db.close();
};

const clearDb = async () => {
  await db.collection('users').deleteMany({});
  return true;
};

module.exports = Object.freeze({
  makeDb,
  closeDb,
  clearDb
});