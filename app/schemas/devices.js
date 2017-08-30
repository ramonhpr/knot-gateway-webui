var joi = require('joi');
var REGEX_MAC = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

var device = {
  name: joi.string().required(),
  mac: joi.string().regex(REGEX_MAC).required()
};

module.exports = {
  device: device
};
