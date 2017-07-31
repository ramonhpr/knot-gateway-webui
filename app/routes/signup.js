var router = require('express').Router(); // eslint-disable-line new-cap
var Joi = require('joi');
var celebrate = require('celebrate');
var REGEX_OWNER = require('../config').REGEX_OWNER;

var usersCtrl = require('../controllers/users');

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string(),
    password: Joi.string(),
    passwordConfirmation: Joi.string(),
    type: Joi.string().regex(/gateway/),
    owner: Joi.string().regex(REGEX_OWNER)
  })
}), usersCtrl.create);

module.exports = {
  router: router
};
