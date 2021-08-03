const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    if (req.path === '/login') {
      return next();
    }
    console.log(req.user);

    const { token } = req.cookies;
    const data = jwt.verify(token, process.env.JWT_KEY);

    const { id, refresh_id } = data; // req.user;
    const user = await User.findOne({
      id,
      refresh_id,
    });

    if (!user) {
      throw new Error('Authentication failed! No User');
    }
    // Attach user to req
    req.user = user;
    return next();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError('Unauthorized!', 403);
    return next(error);
  }
};

module.exports = auth;
