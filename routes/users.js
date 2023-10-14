const users = require('express').Router();
const { validateUserUpdate } = require('../middlewares/requestValidation');
const {
  getMeUser,
  updateUser,
} = require('../controllers/users');

users.get('/users/me', getMeUser);
users.patch('/users/me', validateUserUpdate, updateUser);
module.exports = users;
