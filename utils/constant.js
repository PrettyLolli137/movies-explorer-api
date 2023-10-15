const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/im;

const ConflictMessage = 'Пользователь с таким email уже существует';
const BadRequestMessage = 'Введены некорректные данные';
const UserNotFoundMessage = 'Пользователь с таким id не найден';
const FilmsNotFoundMessage = 'Фильмы не найдены';
const MovieDeleteMessage = 'Фильм удален';
const MovieForbiddenMessage = 'Чужой фильм удалить нельзя';
const MovieNotFoundMessage = 'Фильм с таким id не найден';

module.exports = {
  urlRegex,
  ConflictMessage,
  BadRequestMessage,
  UserNotFoundMessage,
  FilmsNotFoundMessage,
  MovieDeleteMessage,
  MovieForbiddenMessage,
  MovieNotFoundMessage,
};
