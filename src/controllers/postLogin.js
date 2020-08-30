const BadRequestError = require('../errors/BadRequestError');

module.exports = ({ login, log }) => {
  return async (httpRequest) => {
    try {

      const { email, password } = httpRequest.body;
      if (!email || !password) {
        throw new BadRequestError('e-mail and password are mandatory.');
      }

      const token = await login(email, password);

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: { 
          accessToken: token.getAccessToken(),
          exp: token.getExpirationDate()
        }
      };

    } catch (e) {
      log.error(e);

      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: e.statusCode,
        body: {
          error: log.createLogObject(e)
        }
      };
    }
  };
};
