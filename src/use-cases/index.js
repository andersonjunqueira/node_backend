const moment = require('moment');

const md5 = require('../md5');
const log = require('../log');
const passwd = require('../passwd');

const db = require('../data-access');

const makeCreateAccount = require('./createAccount');
const makeLogin = require('./login');
const makeFindUsersById = require('./findUserById');

module.exports = Object.freeze({
  createAccount: makeCreateAccount({ usersDb: db.usersDb, passwd, md5, log }),
  login: makeLogin({ usersDb: db.usersDb, tokensDb: db.tokensDb, md5, moment, log }),
  findUserById: makeFindUsersById({ usersDb: db.usersDb, log }),
});