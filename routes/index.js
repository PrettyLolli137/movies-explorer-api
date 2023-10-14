const router = require('express').Router();
const users = require('./users');
const movies = require('./movies');
const auth = require('../middlewares/auth');
const { validateUser, validateLogin } = require('../middlewares/requestValidation');
const { createUser, login } = require('../controllers/users');

router.post('/signup', validateUser, createUser);
router.post('/signin', validateLogin, login);

router.use('/users', auth, users);
router.use('/movies', auth, movies);

router.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = router;
