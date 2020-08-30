const log = require('../../../src/log');
const makeFakeUser = require('../../fixtures/user');

const makePostCreateAccount = require('../../../src/controllers/postCreateAccount');

describe('post create account', () => {
  let postCreateAccount;
  let createAccount;
  
  beforeEach(async () => {
    createAccount = (params) => makeFakeUser();
    postCreateAccount = makePostCreateAccount({ createAccount, log });
  });

  it('should not create account without full name', async () => {
    try {

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/register',
        requestURL: `http://localhost:3000/api/v0/register`,
        body: { email: 'user@domain.com', password: 'abc123' }
      };

      const response = await postCreateAccount(request);
      expect(response.statusCode).toBe(400);

    } catch (e) {
      log.debug({ msg: e });
      fail('It is not supposed to throw any error');
    }
  });

  it('should not create account without email', async () => {
    try {

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/register',
        requestURL: `http://localhost:3000/api/v0/register`,
        body: { fullName: 'Any Name', password: 'abc123' }
      }

      const response = await postCreateAccount(request)
      expect(response.statusCode).toBe(400)

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  });

  it('should not create account without password', async () => {
    try {

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/register',
        requestURL: `http://localhost:3000/api/v0/register`,
        body: { fullName: 'Any Name', email: 'user@domain.com' }
      }

      const response = await postCreateAccount(request)
      expect(response.statusCode).toBe(400)

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  });

  it('should trigger an internal error', async () => {
    try {

      let createAccountError = (params) => { throw new Error('Internal Error'); };
      let postCreateAccountError = makePostCreateAccount({ createAccount: createAccountError, log });

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/register',
        requestURL: `http://localhost:3000/api/v0/register`,
        body: { fullName: 'Any Name', email: 'user@domain.com', password: 'abc123' }
      }

      const response = await postCreateAccountError(request)
      expect(response.statusCode).toBe(500);
      expect(response.body.error.message).toBe('Internal Error');

    } catch (e) {
      log.debug({ msg: e })
      fail('It is not supposed to throw any error')
    }
  });

  it('should create new user account', async () => {
    try {

      const user = makeFakeUser()
      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/register',
        requestURL: `http://localhost:3000/api/v0/register`,
        body: { fullName: user.fullName, email: user.email, password: user.password }
      }

      const response = await postCreateAccount(request)
      expect(response.statusCode).toBe(201)
      expect(response.headers.Location).toBe(`http://localhost:3000/api/users/${response.body.id}`)

    } catch (e) {
      log.debug(e)
      fail('It is not supposed to throw any error')
    }
  });

});