var router = require('express').Router(); // eslint-disable-line new-cap
var Joi = require('joi');
var celebrate = require('celebrate');
var REGEX_MAC = require('../config').REGEX_MAC;

var devicesCtrl = require('../controllers/devices');

router.get('/', devicesCtrl.list);
router.post('/', celebrate({
  body: Joi.object().keys({
    mac: Joi.string().regex(REGEX_MAC)
  })
}), devicesCtrl.upsert);
router.get('/bcast', devicesCtrl.listBcast);
router.delete('/:id', devicesCtrl.remove);

module.exports = {
  router: router
};
