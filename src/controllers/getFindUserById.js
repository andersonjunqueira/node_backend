module.exports = ({ findUserById, log }) => {
  return async (httpRequest) => {
    try {

      const { id } = httpRequest.params;

      const user = await findUserById(id);
      delete user.password;

      return {
        headers: {
          'Content-Type': 'application/json',
          'Location': 'abc'
        },
        statusCode: 200,
        body: { ...user }
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
