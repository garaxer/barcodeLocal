// The pre-requisite middleware needed is auth.js middle.
const HttpError = require('../models/http-error');

const adminOrUserAuth = async (req, res, next) => {
  console.log('admin or user');

  try {
    const {
      params: { id },
      user,
    } = req;
    if (user.id.toString() !== id && user.permission !== 'admin') {
      throw new Error('Authentication failed, not user and administrator!');
    }
    return next();
  } catch (err) {
    console.log('adminOrUserAuth:', err.message);
    const error = new HttpError(
      'Unauthorized - You must be the user or an administrator to make that change!',
      403
    );
    return next(error);
  }
};

module.exports = adminOrUserAuth;
