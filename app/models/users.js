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
  User.findOneAndUpdate({}, user, { upsert: true }, done);
};

var getUserByUUID = function getUserByUUID(uuid, done) {
  User.findOne({ uuid: uuid }, done);
};

var getUserByEmail = function getUserByEmail(email, done) {
  User.findOne({ email: email }, done);
};

module.exports = {
  setUser: setUser,
  getUserByEmail: getUserByEmail,
  getUserByUUID: getUserByUUID
};
