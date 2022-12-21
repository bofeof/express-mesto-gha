// id < 24, !card => validation err
// id = 24, !card => cast err

let error = null;

// eslint-disable-next-line consistent-return
function validateUserId(id) {
  if (id.length < 24 || id.length > 24) {
    error = { name: 'ValidationError', message: `User with special id - ${id} does not exist. Correct length of id should be 24` };
  }
  if (id.length === 24) {
    error = { name: 'CastError', message: `User with special id - ${id} does not exist in database` };
  }
  return error;
}

module.exports.validateUserId = validateUserId;
