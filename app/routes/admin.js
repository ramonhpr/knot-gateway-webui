var router = require('express').Router(); // eslint-disable-line new-cap
var Joi = require('joi');
var celebrate = require('celebrate');
var REGEX_OWNER = require('../config').REGEX_OWNER;
var REGEX_TOKEN = require('../config').REGEX_TOKEN;
var adminCtrl = require('../controllers/admin');

router.get('/', celebrate({
  body: Joi.object().keys({
    uuidFog: Joi.string().required().regex(REGEX_OWNER),
    tokenFog: Joi.string().required().regex(REGEX_TOKEN),
    uuid: Joi.string().required().regex(REGEX_OWNER),
    token: Joi.string().required().regex(REGEX_TOKEN)
  })
}), adminCtrl.get);
router.post('/reboot', adminCtrl.reboot);

module.exports = {
  router: router
};
