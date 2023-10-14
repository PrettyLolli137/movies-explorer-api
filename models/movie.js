const mongoose = require('mongoose');
const urlRegex = require('../utils/constant');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  director: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  year: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  description: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  image: {
    type: String,
    required: [true, 'Поле "link" должно быть заполнено'],
    validate: {
      validator(v) {
        return urlRegex.test(v);
      },
      message: 'Введен неверный URL',
    },
  },

  trailerLink: {
    type: String,
    required: [true, 'Поле "link" должно быть заполнено'],
    validate: {
      validator(v) {
        return urlRegex.test(v);
      },
      message: 'Введен неверный URL',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле "link" должно быть заполнено'],
    validate: {
      validator(v) {
        return urlRegex.test(v);
      },
      message: 'Введен неверный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
    ref: 'movie',
  },
  nameRU: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },

});

// осталось добавить ссылки

module.exports = mongoose.model('movie', movieSchema);
