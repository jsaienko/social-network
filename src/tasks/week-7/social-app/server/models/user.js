const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret';

const SALT_WORK_FACTOR = 10;

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false,
    set: rawPassword => bcrypt.hashSync(rawPassword, SALT_WORK_FACTOR)
  },
  first_name: String,
  last_name: String,
  age: Number
});

UserSchema.methods.signIn = function (password) {
  return bcrypt.compare(password, this.password)
    .then(() => jwt.sign({_id: this._id}, JWT_SECRET, { expiresIn: '24h' }));
};

UserSchema.statics.verify = function(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded)
    })
  })
};




module.exports = mongoose.model('User', UserSchema);
