const users = require('express').Router();
const { validateUpdateUser } = require('../middlewares/requestValidation');
const {
  getMeUser,
  updateUser,
} = require('../controllers/users');

users.get('/me', getMeUser);
users.patch('/me', validateUpdateUser, updateUser);
module.exports = users;
