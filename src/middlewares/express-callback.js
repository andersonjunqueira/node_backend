module.exports = (controller, log) => {
  return (req, res) => {
    
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      user: req.user,
      requestURL: `${req.protocol}://${req.get('host')}${req.path}`,
      headers: {
        'Content-Type': req.get('Content-Type'),
        Referer: req.get('referer'),
        'User-Agent': req.get('User-Agent')
      }
    };

    controller(httpRequest)
      .then(httpResponse => {

        const headers = Object.assign({}, httpResponse.headers);
        headers['Content-Type'] = 'application/json';
        res.set(headers);

        res.type('json');
        res.status(httpResponse.statusCode);

        // in case of unkown errors, throw a new error
        if (httpResponse.statusCode === 500) {
          log.error(httpResponse.body.error.message);
          res.send({
            error: {
              message: httpResponse.body.error.message,
              stack: httpResponse.body.error.stack
            }
          });
        
        // in case of handled errors
        } else if (httpResponse.body.error) {
          log.error(httpResponse.body.error.message);
          res.send({
            error: {
              message: httpResponse.body.error.message
            }
          });

        // for successfull cases
        } else {
          res.send(httpResponse.body);
        }

      });
  };
};
