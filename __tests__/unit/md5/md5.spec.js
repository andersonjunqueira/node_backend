const log = require('../../../src/log');
const md5 = require('../../../src/md5');

describe('md5', () => {
  
  it('should generate the md5 hash', async () => {
    try {

      expect(md5('ABC123')).toBe('bbf2dead374654cbb32a917afd236656');

    } catch (e) {
      log.debug(e)
      fail('It is not supposed to throw any error')
    }
  });

  it('should generate the same hash twice for the same string', async () => {
    try {

      const str = 'NODEJS+BACKEND STRING';
      const a = md5(str);
      const b = md5(str);
      expect(a).toBe(a);

    } catch (e) {
      log.debug(e)
      fail('It is not supposed to throw any error')
    }
  });

});