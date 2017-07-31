var router = require('express').Router(); // eslint-disable-line new-cap
var Joi = require('joi');
var celebrate = require('celebrate');

var networkCtrl = require('../controllers/network');

router.get('/', celebrate({
  body: Joi.object().keys({
    hostname: Joi.string().required()
  })
}), networkCtrl.get);
router.post('/', celebrate({
  body: Joi.object().keys({
    hostname: Joi.string().required()
  })
}), networkCtrl.update);

module.exports = {
  router: router
};
