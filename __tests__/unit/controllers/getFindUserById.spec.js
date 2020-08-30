const { makeDb, clearDb } = require('../../fixtures/db');
const makeFakeUser = require('../../fixtures/user');
const passwd = require('../../fixtures/passwd');

const log = require('../../../src/log');
const makeUsersDb = require('../../../src/data-access/users-db');
const makeFindUserById = require('../../../src/use-cases/findUserById');
const makeGetFindUserById = require('../../../src/controllers/getFindUserById');
const makeCreateAccount = require('../../../src/use-cases/createAccount');
const md5 = require('../../../src/md5');

describe('get find user', () => {
  let usersDb;
  let findUserById;
  let getFindUserById;
  let createAccount;

  beforeEach(async () => {
    await makeDb();
    await clearDb();
    usersDb = makeUsersDb({ makeDb });
    findUserById = makeFindUserById({ usersDb, log });
    createAccount = makeCreateAccount({ usersDb, passwd, md5, log });
    getFindUserById = makeGetFindUserById({ findUserById, log });
  });

  it('should not find the user', async () => {
    try {

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/users/123456',
        requestURL: `http://localhost:3000/api/v0/users/123456`,
        params: { id: '123456' }
      };
      
      const response = await getFindUserById(request);
      expect(response.body.error.message).toBe('User not found.');
      
    } catch(e) {
      log.debug(e);
      fail('It is not supposed to get here');
    }

  });

  it('should find a user', async () => {
    try {

      const user = makeFakeUser();
      const insertedUser = await createAccount({ fullName: user.fullName, email: user.email, password: user.password });
      expect(insertedUser).toBeTruthy();
      expect(insertedUser.id).toBeTruthy();

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path:`/api/v0/users/${insertedUser.id}`,
        requestURL: `http://localhost:3000/api/v0/users/${insertedUser.id}`,
        params: { 
          id: insertedUser.id 
        }
      }

      const response = await getFindUserById(request);
      expect(response).toBeTruthy();
      expect(response.statusCode).toBe(200);

    } catch(e) {
      log.debug(e);
      fail('It is not supposed to throw any error');
    }
  });

});
