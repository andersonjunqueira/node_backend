const sanitizeHtml = require('sanitize-html');
const moment = require('moment');

const buildMakeUser = require('./user');
const Id = require('../../Id');
const md5 = require('../../md5');

const sanitize = (text) => {
  return sanitizeHtml(text, {
//    allowedIframeHostnames: ['codesandbox.io', 'repl.it']
  });
};

const validateEmail = (value) => {
  if (typeof value !== 'undefined') {
    const email = value.trim();
    const re = /^[a-zA-Z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
    return re.test(email);
  }
  return false;
};

module.exports = buildMakeUser({ Id, md5, sanitize, validateEmail, moment });
