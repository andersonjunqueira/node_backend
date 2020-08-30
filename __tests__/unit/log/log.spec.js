const log = require('../../../src/log');

describe('log', () => {
  
  const consoleLog = console.log;
  const consoleInfo = console.info;
  const consoleError = console.error;
  const consoleTrace = console.trace;

  beforeAll(async () => {
    console.log = jest.fn();
    console.info = jest.fn();
    console.error = jest.fn();
    console.trace = jest.fn();
  });
  
  afterAll(async () => {
    console.log = consoleLog;
    console.info = consoleInfo;
    console.error = consoleError;
    console.trace = consoleTrace;
  });
  
  it('should print the info log', async () => {
    try {
      
      log.info('MESSAGE');
      expect(console.info).toHaveBeenCalled();
      expect(console.trace).not.toHaveBeenCalled();

    } catch (e) {
      consoleLog(e);
      fail('It is not supposed to throw any error')
    }
  });

  it('should print the debug log', async () => {
    try {
      
      log.debug('MESSAGE');
      expect(console.log).toHaveBeenCalled();
      expect(console.trace).not.toHaveBeenCalled();

    } catch (e) {
      consoleLog(e);
      fail('It is not supposed to throw any error')
    }
  });

  it('should print the debug log', async () => {
    try {
      
      log.error('MESSAGE');
      expect(console.error).toHaveBeenCalled();
      expect(console.trace).toHaveBeenCalled();

    } catch (e) {
      consoleLog(e);
      fail('It is not supposed to throw any error')
    }
  });

})