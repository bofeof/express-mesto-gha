const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const defineError = require('../utils/errorHandler/ErrorHandler');
const { errorAnswers } = require('../utils/constants');

let error;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return (/^(http|https)\W+[w]{0,3}\S*[#]*$/gi).test(v);
      },
      message: 'Incorrect avatar link',
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Incorrect email address',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.index({ email: 1 }, { unique: true });

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = {
          name: 'UnauthorizedError',
          message: 'Unauthorized error. User with these combination of email and password does not exist',
        };
        error = defineError(err, errorAnswers.wrongEmailPassword);
        return Promise.reject(error);
      }

      // user exists, password check
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const err = {
            name: 'UnauthorizedError',
            message: 'Unauthorized error. User already exists. Wrong password',
          };
          error = defineError(err, errorAnswers.wrongEmailPassword);
          return Promise.reject(error);
        }
        // user exists, password is correct
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
