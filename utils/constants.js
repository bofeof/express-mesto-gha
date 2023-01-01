// messages for user
const errorAnswers = {
  gettingCardsError: 'Невозможно получить карточки',
  gettingUsersError: 'Невозможно получить пользователей',
  userIdError: 'Невозможно найти пользователя по id. Не существует в базе',
  cardIdError: 'Невозможно найти карточку по id. Не существует в базе',
  creationCardError: 'Невозможно создать карточку. Переданы некорректные данные',
  creationUserError: 'Невозможно создать пользователя. Переданы некорректные данные, либо пользователь с указанной почтой уже существует',
  updatingUserError: 'Невозможно обновить данные пользователя. Переданы некорректные данные, либо задан неверный id пользователя',
  updatingAvatarError: 'Невозможно обновить аватар пользователя. Переданы некорректные данные, либо задан неверный id пользователя',
  removingCardError: 'Невозможно удалить карточку. Задан неверный id карточки, карточка не существует в базе',
  settingLikeError: 'Невозможно поставить лайк карточке. Переданы некорректные данные, либо задан неверный id карточки',
  removingLikeError: 'Невозможно снять лайк с карточки. Переданы некорректные данные, либо задан неверный id карточки',
  invalidIdError: 'Заданный id параметр в запросе некорректный',
  wrongEmailPassword: 'Ошибка входа в Mesto: неправильные почта и(или) пароль',
  authError: 'Необходима авторизация',
  tokenError: 'Ошибка с токеном авторизации',
  forbiddenError: 'Недостаточно прав для совершения действия',
  getCardInfoError: 'Невозможно получить данные о карточке, чтобы совершать с ней дальнейшие действия',
  routeError: 'Ошибка роутинга. Некорректный url адрес, запрос',
};
const logFile = 'logs/Logs.log';

module.exports.errorAnswers = errorAnswers;
module.exports.logFile = logFile;
