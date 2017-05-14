var crypto = require('crypto');
var ITERATION_COUNT = 5000;
var SALT_LENGTH = 32;
var KEY_LENGTH = 32;

var createPasswordHash = function createPasswordHash(password) {
  var salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  var key = crypto.pbkdf2Sync(password, salt, ITERATION_COUNT, KEY_LENGTH, 'sha256').toString('hex');
  var hash = salt + '|' + key;
  return hash;
};

var isValidPassword = function isValidPassword(password, hash) {
  var hashSplited = hash.split('|');
  var salt = hashSplited[0];
  var passwordHash = hashSplited[1];
  var key = crypto.pbkdf2Sync(password, salt, ITERATION_COUNT, KEY_LENGTH, 'sha256').toString('hex');
  return key === passwordHash;
};

module.exports = {
  createPasswordHash: createPasswordHash,
  isValidPassword: isValidPassword
};
