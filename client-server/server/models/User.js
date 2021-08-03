const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const jwt = require('jsonwebtoken');
const HttpError = require('./http-error');
const db = require('../db');

/**
 * Given a user from the db returns a JWT token
 * @param {User} user The user object used to generate a JWT
 */
const generateAuthToken = (user) => {
  // Generate an auth token for the user
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      permission: user.permission,
      refresh_id: user.refresh_id,
    },
    process.env.JWT_KEY,
    { expiresIn: '12h' }
  );
  return token;
};

/**
 * Finds a user given an email and password.
 * @param {string} email
 * @param {string} password
 * @returns {User}
 */
const findByCredentials = async (email, password) => {
  const results = await db.query('select * from users where email = $1', [
    email,
  ]);

  const user = results.rows[0];

  if (!user) {
    throw new HttpError('Invalid login credentials - email', 403);
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new HttpError('Invalid login credentials - password', 403);
  }
  return user;
};

/**
 * Adds a new uuid to the refresh Id,
 * As the refresh id is stored in the jwt, if this is changed,
 * users won't be able to use that jwt, they will need to log back in and get a new jwt.
 *
 * @param {User} user
 */
const addUuidToRefreshToken = (user) => ({ ...user, refresh_id: uuidv4() });

/**
 * Finds a single user given a filter object
 * @param {Filter} filter
 */
const findOne = async (filter) => {
  const keys = Object.keys(filter).map((x) =>
    x === 'id' ? parseInt(filter[x], 10) : filter[x]
  );
  const wheres = Object.keys(filter)
    .map((k, i) => `${k} = $${i + 1}`)
    .join(' and ');

  const sql = `select * from users where ${wheres}`;
  const params = keys;

  const results = await db.query(sql, params);
  const user = results && results.rows[0];
  return user;
};

/**
 * Given a user check a few requirements before.
 * Used before saving the user to the database
 * @param {User} user
 */
const userBeforeSave = async (user) => {
  console.log('user being edited in presave', user);

  const results = await db.query('select * from users where email = $1', [
    user.email,
  ]);
  const existingUser = results && results.rows[0];
  // If there is an existing user with that email,
  // If not user id had been provided, then it must be a new user
  // Or if the user id we are editing matches the existing user,
  // then we are editing that users email back to what it was
  if (
    existingUser &&
    (!user.id || user.id.toString() !== existingUser.id.toString())
  ) {
    throw new HttpError('Users email already exists.', 422);
  }

  // hash password
  if (user.password) {
    console.log('User password changed');
    const hashedPassword = await bcrypt.hash(user.password, 8);
    // password has changed, log out all the other sessions

    return { ...addUuidToRefreshToken(user), password: hashedPassword };
  }
  return user;
};

module.exports = {
  generateAuthToken,
  findByCredentials,
  userBeforeSave,
  addUuidToRefreshToken,
  findOne,
};
