var joi = require('joi');

var hostname = {
  hostname: joi.string().hostname().required()
};

module.exports = {
  hostname: hostname
};
