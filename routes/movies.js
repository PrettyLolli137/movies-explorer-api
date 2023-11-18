const movies = require('express').Router();
const { validateMovie, validateId } = require('../middlewares/requestValidation');

const {
  getMovie,
  createMovie,
  deleteMovie,

} = require('../controllers/movies');

movies.get('/', getMovie);
movies.post('/', validateMovie, createMovie);
movies.delete('/:movieId', validateId, deleteMovie);

module.exports = movies;
