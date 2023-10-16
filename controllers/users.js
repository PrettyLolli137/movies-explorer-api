const { SECRET_KEY = 'some-secret-key' } = process.env;
const { default: mongoose } = require('mongoose');
const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const {
  ConflictMessage,
  BadRequestMessage,
  UserNotFoundMessage,
} = require('../utils/constant');

module.exports.getMeUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((currentUser) => res.send(currentUser))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(UserNotFoundMessage));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`${BadRequestMessage} : ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(HTTP_STATUS_CREATED).send({
      _id: user._id, name: user.name, email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(ConflictMessage));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`${BadRequestMessage} : ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: 'true', runValidators: true },
    )
      .orFail()
      .then((user) => res.status(HTTP_STATUS_OK).send(user))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError(err.message));
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          next(new NotFoundError('Пользователь по указанному _id не найден'));
        } else {
          next(err);
        }
      });
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
