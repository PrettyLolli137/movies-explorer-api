const { default: mongoose } = require('mongoose');
const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovie = (req, res, next) => {
  Movie.find({})
    .populate(['owner', 'movieId'])
    .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
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
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      Movie.findById(movie._id)
        .orFail()
        .populate('owner')
        .then((data) => res.status(HTTP_STATUS_CREATED).send(data))
        .catch(() => res
          .status(404)
          .send({ message: 'Фильма  с указанным  _id не найдено' }));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Фильма  с таким _id нету'));
      } else {
        next(err);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Фильм другого пользователя');
      }
      Movie.deleteOne(movie)
        .orFail()
        .then(() => {
          res.status(HTTP_STATUS_OK).send({ message: 'Фильм удален' });
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(
              new NotFoundError(
                `Фильм с таким _id ${req.params.movieId} не найден `,
              ),
            );
          } else if (err instanceof mongoose.Error.CastError) {
            next(
              new BadRequestError(
                `Некорректный _id у фильма ${req.params.movieId} `,
              ),
            );
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        next(
          new NotFoundError(
            `Фильм с таким _id ${req.params.movieId} не найден `,
          ),
        );
      } else {
        next(err);
      }
    });
};
/*
if (req.params.movieId.length === 24) {
  Movie.findByIdAndDelete(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        res.status(404).send({ message: 'Фильма с таким _id нету' });
        return;
      }
      res.send({ message: 'Фильм удален' });
    })
    .catch(() => res.status(404).send({ message: 'Фильма с таким _id нету' }));
} else {
  res.status(400).send({ message: 'Некорректный _id фильма' });
}
};

    .then((movie) => {
      Movie.findById(movie._id)
        .orFail()
        .populate('owner')
        .then((data) => res.status(HTTP_STATUS_CREATED).send(data))
        .catch(() => res
          .status(404)
          .send({ message: 'Фильма  с указанным  _id не найдено' }));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Фильма  с таким _id нету'));
      } else {
        next(err);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};
HTTP_STATUS_CREATED
*/
