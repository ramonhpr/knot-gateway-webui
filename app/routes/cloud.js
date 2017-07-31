var router = require('express').Router(); // eslint-disable-line new-cap
var Joi = require('joi');
var celebrate = require('celebrate');

var cloudCtrl = require('../controllers/cloud');

router.get('/', celebrate({
  body: Joi.object().keys({
    servername: Joi.string().required(),
    port: Joi.number().required()
  })
}), cloudCtrl.get);
router.post('/', celebrate({
  body: Joi.object().keys({
    servername: Joi.string().required(),
    port: Joi.number().integer().required()
  })
}), cloudCtrl.upsert);

module.exports = {
  router: router
};
