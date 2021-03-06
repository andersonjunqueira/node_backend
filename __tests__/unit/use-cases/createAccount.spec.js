const { makeDb, clearDb } = require('../../fixtures/db');
const makeFakeUser = require('../../fixtures/user');
const passwd = require('../../fixtures/passwd');

const log = require('../../../src/log');
const makeCreateAccount = require('../../../src/use-cases/createAccount');
const makeUsersDb = require('../../../src/data-access/users-db');
const md5 = require('../../../src/md5');

describe('create account use case', () => {
  let usersDb;
  let createAccount;
  
  beforeEach(async () => {
    await makeDb();
    await clearDb();
    usersDb = makeUsersDb({ makeDb });
    createAccount = makeCreateAccount({ usersDb, passwd, md5, log });
  });

  it('should create new user account', async () => {
    try {

      const user = makeFakeUser();
      const inserted = await createAccount({ fullName: user.fullName, email: user.email, password: user.password });
      expect(inserted).toBeTruthy();
      expect(inserted.email).toBe(user.email);
      expect(inserted.fullName).toBe(user.fullName);

    } catch (e) {
      log.debug(e);
      fail('It is not supposed to throw any error');
    }
  });

  it('should not create a duplicated account', async () => {
    try {

      const user = makeFakeUser();
      const inserted = await createAccount({ fullName: user.fullName, email: user.email, password: user.password });
      expect(inserted).toBeTruthy();
      expect(inserted.email).toBe(user.email);

      await createAccount({ fullName: user.fullName, email: user.email, password: user.password });
      fail('It is not supposed to get to this point');

    } catch (e) {
      expect(e.message).toBe('E-mail already registered.');
    }
  });

  it('should create new user account', async () => {
    try {

      const user = makeFakeUser();
      await createAccount({ fullName: user.fullName, email: user.email, password: 'ab' });
      fail('It is not supposed to get to this point');
      
    } catch (e) {
      expect(e.message).toBe('Password must contain at least 3 characters.');
    }
  });

});
