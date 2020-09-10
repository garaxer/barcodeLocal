const HttpError = require('../models/http-error');

const adminAuth = async (req, res, next) => {
  console.log('log 50 admin');
  try {
    if (req.user.permission.toString() !== 'admin') {
      throw new Error('Authentication failed!');
    }
    return next();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Unauthorized - no permission!', 403);
    return next(error);
  }
};

module.exports = adminAuth;
