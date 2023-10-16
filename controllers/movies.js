const { default: mongoose } = require('mongoose');
const { HTTP_STATUS_CREATED } = require('http2').constants;
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  BadRequestMessage,
  FilmsNotFoundMessage,
  MovieDeleteMessage,
  MovieForbiddenMessage,
  MovieNotFoundMessage,
} = require('../utils/constant');

module.exports.getMovie = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(FilmsNotFoundMessage));
      } else {
        next(err);
      }
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(HTTP_STATUS_CREATED).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`${BadRequestMessage} : ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail()
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        Movie.deleteOne({ _id: movie._id })
          .then(() => res.send({ message: MovieDeleteMessage }))
          .catch(next);
      } else {
        throw new ForbiddenError(MovieForbiddenMessage);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`${BadRequestMessage} : ${err.message}`));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(MovieNotFoundMessage));
      } else {
        next(err);
      }
    });
};

/*
 Movie.findById(req.params.movieId)
    .orFail()
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        Movie.deleteOne(movie)
          .then(() => res.send({ message: MovieDeleteMessage }))
          .catch(next);
      } else {
        throw new ForbiddenError(MovieForbiddenMessage);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`${BadRequestMessage} : ${err.message}`));
      } else if (err instanceof Error.DocumentNotFoundError) {
        next(new NotFoundError(MovieNotFoundMessage));
      } else {
        next(err);
      }
    });
*/
