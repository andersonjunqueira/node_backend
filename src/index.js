const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const makeCallback = require('./middlewares/express-callback');
const log = require('./log');
const ctrls = require('./controllers');

const apiRoot = process.env.ENV_API_ROOT

const app = express()
app.use(bodyParser.json())

app.post(`${apiRoot}/v0/register`, makeCallback(ctrls.postCreateAccount, log));
app.post(`${apiRoot}/v0/login`, makeCallback(ctrls.postLogin));
app.get(`${apiRoot}/v0/users/:id`, makeCallback(ctrls.getFindUserById));

app.listen(process.env.ENV_SERVER_PORT, () => {
  log.info(`Server is listening on port ${process.env.ENV_SERVER_PORT}`);
})

module.exports = app;
