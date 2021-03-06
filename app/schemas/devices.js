var joi = require('joi');
var REGEX_MAC = /^([0-9A-Fa-f]{2}[:-]){7}([0-9A-Fa-f]{2})$/;

var update = {
  body: {
    name: joi
      .string()
      .required(),
    allowed: joi
      .bool()
      .required()
  },
  params: {
    id: joi
      .string()
      .regex(REGEX_MAC)
      .required()
  }
};


module.exports = {
  update: update
};
