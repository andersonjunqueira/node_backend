const dotenv = require('dotenv');
const moment = require('moment');

const { makeDb, clearDb } = require('../../fixtures/db');
const makeFakeUser = require('../../fixtures/user');
const passwd = require('../../fixtures/passwd');

const log = require('../../../src/log');
const makeUsersDb = require('../../../src/data-access/users-db');
const makeTokensDb = require('../../../src/data-access/tokens-db');
const makeFindUserById = require('../../../src/use-cases/findUserById');
const makeLogin = require('../../../src/use-cases/login');
const makeCreateAccount = require('../../../src/use-cases/createAccount');
const md5 = require('../../../src/md5');

describe('login use case', () => {

  let usersDb;
  let tokensDb;
  let login;
  let createAccount;
  let findUserById;

  beforeAll(async () => {
    const PRESET = process.env.ENV_LOGIN_ATTEMPTS_BLOCK;
  });

  beforeEach(async () => {
    await makeDb();
    await clearDb();
    usersDb = makeUsersDb({ makeDb });
    tokensDb = makeTokensDb({ makeDb });
    login = makeLogin({ usersDb, tokensDb, md5, moment, log });
    createAccount = makeCreateAccount({ usersDb, passwd, md5, log });
    findUserById = makeFindUserById({ usersDb, log });

    jest.resetModules();
  });

  afterEach(async () => {
    delete process.env.ENV_LOGIN_ATTEMPTS_BLOCK;
    process.env.ENV_LOGIN_ATTEMPTS_BLOCK = PRESET;
  });

  it('should not login with a wrong email', async () => {
    try {

      await login('user@domain.com', 'abc123');
      fail('It is not supposed to get to this point');

    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password.');
    }
  });

  it('should not login with a wrong password', async () => {
    try {

      const user = makeFakeUser();
      await createAccount({ fullName: user.fullName, email: user.email, password: user.password });

      await login(user.email, 'abc123');
      fail('It is not supposed to get to this point');

    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password. You have 2 attenpts before the user is blocked.');
    };
  })

  it('should successfully login', async () => {

    const userInfo = makeFakeUser({ password: 'abc123' });
    const user = await createAccount({ fullName: userInfo.fullName, email: userInfo.email, password: userInfo.password });

    try {

      const token = await login(user.email, 'abc123');
      expect(token.getUserId()).toBe(user.id);
      expect(token.getAccessToken()).toBeTruthy();

    } catch (e) {
      log.debug(e);
      fail('It is not supposed to throw any error');
    }
  });

  it('should block a user if login is wrong 3x', async () => {
    process.env.ENV_LOGIN_ATTEMPTS_BLOCK = 3;
    
    const user = makeFakeUser();
    const acc = await createAccount({ fullName: user.fullName, email: user.email, password: user.password });
    
    try {
      await login(user.email, 'abc123');
    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password. You have 2 attenpts before the user is blocked.');
    }

    try {
      await login(user.email, 'abc123');
    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password. You have 1 attenpts before the user is blocked.');
    }

    try {
      await login(user.email, 'abc123');
    } catch (e) {
      expect(e.message).toBe('This user is blocked.');
    }

    const found = await findUserById(acc.id);

    expect(found).toBeTruthy();
    expect(found.email).toBe(acc.email);
    expect(found.blockedOn).toBeTruthy();
  });

  it('should not block a user due to config', async () => {
    delete process.env.ENV_LOGIN_ATTEMPTS_BLOCK;
    dotenv.config({ path: './no-user-blocking.env' });

    const user = makeFakeUser();
    const acc = await createAccount({ fullName: user.fullName, email: user.email, password: user.password });

    try {
      await login(user.email, 'abc123');
    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password.');
    }

    try {
      await login(user.email, 'abc123');
    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password.');
    }

    try {
      await login(user.email, 'abc123');
    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password.');
    }

    const found = await findUserById(acc.id);

    expect(found).toBeTruthy();
    expect(found.email).toBe(acc.email);
    expect(found.blockedOn).toBeFalsy();
  });

  it('should not login a blocked user with correct password', async () => {
    process.env.ENV_LOGIN_ATTEMPTS_BLOCK = 3;

    const user = makeFakeUser();
    const acc = await createAccount({ fullName: user.fullName, email: user.email, password: user.password });

    try {
      await login(user.email, 'abc123');
      fail('It is not supposed to get to this point');
    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password. You have 2 attenpts before the user is blocked.');
    }

    try {
      await login(user.email, 'abc123');
      fail('It is not supposed to get to this point');
    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password. You have 1 attenpts before the user is blocked.');
    }

    try {
      await login(user.email, 'abc123');
      fail('It is not supposed to get to this point');
    } catch (e) {
      expect(e.message).toBe('This user is blocked.');
    }

    try {
      await login(user.email, user.password);
      fail('It is not supposed to get to this point');
    } catch (e) {
      expect(e.message).toBe('This user is blocked.');
    }
  });

});
