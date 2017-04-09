var router = require('express').Router(); // eslint-disable-line new-cap
var request = require('request');
var users = require('../models/users');
var cloudConfig = require('../models/cloud');

var resetPassword = function (cloud, email, cb) {
  request({
    url: 'http://' + cloud.servername + ':' + cloud.port + '/devices/user/reset',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: { user: { email: email } }
  }, function (error, response, body) {
    var result;
    if (body) {
      result = JSON.parse(body);
      console.log(result);
    }
    if (error) {
      console.log('Error registering gateway on cloud: ' + error);
      error.status = 500;
      cb(error, null);
    } else if (!result.user) {
      // if there is no user field so it is a error response
      console.log(result.message);
      cb(result, null);
    } else {
      result = JSON.parse(body);
      cb(null, result);
    }
  });
};

var post = function post(req, res) {
  cloudConfig.getCloudSettings(function onCloudSettingsSet(err1, cloud) {
    if (err1) {
      res.sendStatus(400);
    } else if (!cloud) {
      res.sendStatus(400);
    } else {
      resetPassword(cloud, req.body.email, function (err3, result) {
        if (err3) {
          res.sendStatus(err3.status);
        } else {
          users.updatePassword(result.user.password, function (err4) {
            if (err4) {
              res.sendStatus(500);
            } else {
              res.end();
            }
          });
        }
      });
    }
  });
};

router.post('/', post);

module.exports = {
  router: router
};
