const log = require('../log');

// import use cases
const cases = require('../use-cases');

// import controllers
const makePostCreateAccount = require('./postCreateAccount');
const makePostLogin = require('./postLogin');
const makeGetFindUserById = require('./getFindUserById');

// create the controllers
const postCreateAccount = makePostCreateAccount({ createAccount: cases.createAccount, log });
const postLogin = makePostLogin({ login: cases.login, log });
const getFindUserById = makeGetFindUserById({ findUserById: cases.findUserById, log });

// export the controllers
module.exports = Object.freeze({
  postCreateAccount,
  postLogin,
  getFindUserById,
});

