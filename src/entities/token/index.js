const buildMakeToken = require('./token');
const Id = require('../../Id');
const jwt = require('../../jwt');
const moment = require('moment');

module.exports = buildMakeToken({ Id, jwt, moment });
