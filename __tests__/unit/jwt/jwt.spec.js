const makeFakeUser = require('../../fixtures/user');
const jwt = require('../../../src/jwt');

describe('jwt', () => {
  
  it('should generate and decode the jwt', async () => {
    try {
      
      const user = makeFakeUser();
      const token = jwt.generate({ user });
      const decoded = jwt.decode(token);

      expect(decoded.data.id).toBe(user.id);
      expect(decoded.data.email).toBe(user.email);
      expect(decoded.data.password).toBeFalsy();
      
    } catch (e) {
      fail('It is not supposed to throw any error')
    }
  });

})