const movies = require('express').Router();
const { validateMovie, validateId } = require('../middlewares/requestValidation');

const {
  getMovie,
  createMovie,
  deleteMovie,

} = require('../controllers/movies');

movies.get('/movies', getMovie);
movies.post('/movies', validateMovie, createMovie);
movies.delete('/movies/:movieId', validateId, deleteMovie);

module.exports = movies;
