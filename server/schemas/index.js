const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  info: {
    displayName: String,
    city: String,
    state: String
  },
  twitter: {
    id: String,
    username: String,
    token: String,
  }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};



module.exports = {
  User: mongoose.model('User', userSchema),
  Book: require('./book'),
  Trade: require('./trade')
};
