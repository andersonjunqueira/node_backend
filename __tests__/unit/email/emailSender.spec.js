const nodemailer = require('nodemailer');

const makeEmailer = require('../../../src/email/emailer');
const makeEmailSender = require('../../../src/email/emailSender');
const log = require('../../../src/log');

describe('email sender', () => {

  const emailer = makeEmailer({ nodemailer });
  const sender = makeEmailSender({ emailer, log });

  it('should send forgot password email ', async (done) => {
    try {
      
      const res = sender.sendForgotPassword(
        ['anderson.junqueira@gmail.com'], 
        'Anderson Junqueira', 
        'ABC123'
      ).then(info => {

        expect(info).toBeTruthy();
        expect(info.messageId).toBeTruthy();
        done();

      }).catch(err => {
        fail('It is not supposed to fail');
        done();
      });

    } catch (e) {
      log.debug(e);
      fail('It is not supposed to throw any error');
      done();
    }
  });

  it('should send changed password email ', async (done) => {
    try {
      
      const res = sender.sendChangedPassword(
        ['anderson.junqueira@gmail.com'], 
        'Anderson Junqueira'
      ).then(info => {

        expect(info).toBeTruthy();
        expect(info.messageId).toBeTruthy();
        done();

      }).catch(err => {
        fail('It is not supposed to fail');
        done();
      });

    } catch (e) {
      log.debug(e);
      fail('It is not supposed to throw any error');
      done();
    }

  });
});