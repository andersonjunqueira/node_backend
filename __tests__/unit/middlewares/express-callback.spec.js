const log = require('../../../src/log');
const Response = require('../../fixtures/Response');
const makeExpressCallback = require('../../../src/middlewares/express-callback');

describe('express callback', () => {

  let req;
  let res;

  beforeEach(async () => {
    
    req = {
      protocol: 'http',
      ip: '127.0.0.1',
      method: 'POST',
      path: '/api/v0/call',
      query: {},
      params: {},
      user: undefined,
      get: p => {
        switch(p) {
          case 'Content-Type': 
            return 'application/json';
          case 'host':
            return "localhost:3000";
          case 'referer':
            return undefined;
          case 'User-Agent':
            return 'PostmanRuntime/7.25.0';
        }
      }
    };

  });

  it('should process a successfull call', async () => {
    try {

      req.body = {
        fullName: 'Test User 2',
        email: 'user2@domain.com',
        password: '12A@3456'
      };

      const controller = httpRequest => new Promise((resolve, reject) => {
        const response = {
          headers: {},
          statusCode: 201,
          body: {
            success: true
          }
        };
        resolve(response);
      });

      const expressCallback = makeExpressCallback(controller, log);
      const res = new Response();
      await expressCallback(req, res);

      expect(res.status()).toBe(201);
      expect(res.type()).toBe('json');
      expect(res.body.error).toBeFalsy();

    } catch (e) {
      log.debug({ msg: e });
      fail('It is not supposed to throw any error');
    }
  });

  it('should process an internal error', async () => {
    try {

      req.body = {
        email: 'user2@domain.com',
        password: '12A@3456'
      };

      const controller = httpRequest => new Promise((resolve, reject) => {
        const response = {
          headers: {},
          statusCode: 400,
          body: {
              error: {
                message: 'Internal Error',
                stack: 'Error Stack'
              }
          }
        };
        resolve(response);
      });

      const expressCallback = makeExpressCallback(controller, log);
      const res = new Response();
      await expressCallback(req, res);

      expect(res.status()).toBe(400);
      expect(res.type()).toBe('json');
      expect(res.body.error).toBeTruthy();
      expect(res.body.error.message).toBeTruthy();
      expect(res.body.error.stack).toBeFalsy();

    } catch (e) {
      log.debug({ msg: e });
      fail('It is not supposed to throw any error');
    }
  });

  it('should process a system error', async () => {
    try {

      req.body = {
        email: 'user2@domain.com',
        password: '12A@3456'
      };

      const controller = httpRequest => new Promise((resolve, reject) => {
        const response = {
          headers: {},
          statusCode: 500,
          body: {
            error: {
              message: 'System Error',
              stack: 'Error Stack'
            }
        }
        };
        resolve(response);
      });

      const expressCallback = makeExpressCallback(controller, log);
      const res = new Response();
      await expressCallback(req, res);

      expect(res.status()).toBe(500);
      expect(res.type()).toBe('json');
      expect(res.body.error).toBeTruthy();
      expect(res.body.error.message).toBeTruthy();
      expect(res.body.error.stack).toBeTruthy();

    } catch (e) {
      log.debug({ msg: e });
      fail('It is not supposed to throw any error');
    }
  });


});