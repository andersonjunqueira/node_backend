const BadRequestError = require('../errors/BadRequestError');

module.exports = ({ createAccount, log }) => {
  return async (httpRequest) => {
    try {

      log.info(`[postCreateAccount] Checking required parameters`); 
      const { fullName, email, password } = httpRequest.body;
      if (!fullName || !email || !password) {
        throw new BadRequestError('Full name, e-mail and password are mandatory.');
      }

      log.info(`[postCreateAccount] Calling createAccount controller`); 
      const insertedUser = await createAccount({ fullName, email, password });

      log.info(`[postCreateAccount] Removing password from inserted user`); 
      delete insertedUser.password;

      log.info(`[postCreateAccount] Adding the Location header`); 
      let location = httpRequest.requestURL;
      location = `${location.substr(0, location.indexOf(httpRequest.path))}${process.env.ENV_API_ROOT}/users/${insertedUser.id}`;

      log.info(`[postCreateAccount] Returning the user`); 
      return {
        headers: {
          'Location': location
        },
        statusCode: 201,
        body: { ...insertedUser }
      };

    } catch (ex) {
      return {
        statusCode: ex.statusCode || 500,
        body: {
          error: log.createLogObject(ex)
        }
      };
    }
  };
};
