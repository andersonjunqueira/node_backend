const jwt = require('jsonwebtoken');
const moment = require('moment');

const generate = ({ user, exp }) => {
  delete user.password;
  const expireOn = exp || moment.utc(Date.now()).add(1, 'hours').valueOf();
  const token = jwt.sign({ exp: expireOn, data: user }, process.env.ENV_JWT_SECRET);
  return token;
};

const decode = (token) => {
  const decoded = jwt.verify(token, process.env.ENV_JWT_SECRET);
  return decoded;
};

module.exports = Object.freeze({
  generate,
  decode
});
