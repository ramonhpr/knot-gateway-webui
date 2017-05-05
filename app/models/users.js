var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  password: String,
  uuid: String,
  token: String
});

var User = mongoose.model('User', userSchema);

var setUser = function setUser(user, done) {
  User.findOneAndUpdate({}, user, { upsert: true }, function (err) {
    if (err) {
      done(err);
    } else {
      done(null);
    }
  });
};

var getUserByUUID = function getUserByUUID(uuid, done) {
  User.findOne({ uuid: uuid }, function (err, user) {
    if (err) {
      done(err);
    } else {
      done(null, user);
    }
  });
};

var getUserByCredentials = function getUserByCredentials(credentials, done) {
  User.findOne({ email: credentials.email, password: credentials.password }, function (err, user) {
    if (err) {
      done(err);
    } else {
      done(null, user);
    }
  });
};

module.exports = {
  setUser: setUser,
  getUserByCredentials: getUserByCredentials,
  getUserByUUID: getUserByUUID
};
