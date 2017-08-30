var joi = require('joi');

var settings = {
  servername: joi.string().hostname().required(),
  port: joi.number().integer().min(1).max(65535)
  .required()
};

module.exports = {
  settings: settings
};
