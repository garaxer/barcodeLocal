const db = require('../db');
const HttpError = require('../models/http-error');
const { errorHandler } = require('../models/http-error');
const User = require('../models/User');
const { parseFilter } = require('../util');

const getUsers = errorHandler(
  'Getting users failed. Try again later.',
  400
)(async (req, res) => {
  const { query } = req;
  /**
   * Gets users, handles the following parameters
   */
  // http://localhost:8080/api/users?sort=["name","DESC"]&range=[0, 3]&filter={"name":"gary"}

  let queryParams;
  try {
    queryParams = Object.keys(query).reduce(
      (a, c) => ({ ...a, [c]: (() => JSON.parse(query[c]))() }),
      {}
    );
  } catch (error) {
    throw new HttpError('Could not parse query parameters', 400);
  }
  const { sort, range, filter } = queryParams;

  // Handle no parameters
  if (![sort, range, filter].some((x) => x)) {
    const results = await db.query('SELECT * FROM users ORDER BY id ASC');
    return res.status(200).json(results.rows);
  }

  // Handle no range
  const [rangeStart, rangeEnd] = range
    ? [parseInt(range[0], 10), parseInt(range[1], 10)]
    : [0, 5];

  // Sanitize order options
  const orderOptions = (s) =>
    ['ID', 'name', 'email', 'createdAt', 'permission'].includes(s) ? s : 'ID';
  const orderingOptions = (s) => (['ASC', 'DESC'].includes(s) ? s : 'ASC');

  // Sanitize sort options
  const [orderBy, ordering] = sort
    ? [orderOptions(sort[0]), orderingOptions(sort[1])]
    : [null, null];

  // create query string from filters. Add +3 to account for limits
  const [filterSql, filterParams] = filter ? parseFilter(filter) : ['', ''];

  // Don't limit if -1 is passed in as a limit
  const shouldntLimit = rangeEnd === -1;
  const limitSql = shouldntLimit
    ? ''
    : `limit $${filterParams.length + 1} offset $${filterParams.length + 2}`;
  const limitParams = shouldntLimit ? [] : [rangeEnd - rangeStart, rangeStart];

  const orderSql = orderBy ? `ORDER BY ${orderBy} ${ordering}` : '';

  const sql = `SELECT id, name, email, company_id, permission, createdat FROM users ${filterSql} ${orderSql} ${limitSql}`;

  const params = [...filterParams, ...limitParams];
  console.log(sql);

  const results = await db.query(sql, params);

  // Get the total records and add it to the header
  const countResults = await db.query(
    `select COUNT(*) from users ${filterSql};`,
    filterParams
  );
  const { count } = countResults.rows[0];
  res.setHeader('content-range', `${rangeStart}-${rangeEnd}/${count}`);
  console.log('setting type');

  console.log(res.getHeader('content-range'));
  return res.status(200).json(results.rows);
});

const getUser = errorHandler(
  'Getting user failed. Try again later.',
  400
)(async (req, res) => {
  const { id } = req.params;
  const {
    rows,
  } = await db.query(
    'SELECT id, name, email, permission FROM users WHERE id = $1',
    [id]
  );
  res.send(rows[0]);
});

const createUser = errorHandler(
  'Creating users failed. Try again later.',
  400
)(async (req, res) => {
  if (!req.body.email) {
    throw new HttpError('No email in create user body');
  }
  const userBeforeSave = await User.userBeforeSave(req.body);
  const user = User.addUuidToRefreshToken(userBeforeSave);

  const keys = Object.keys(user).join(', ');
  const values = Object.keys(user)
    .map((_, i) => `$${i + 1}`)
    .join(', ');
  const sql = `INSERT INTO users (${keys}) VALUES (${values}) RETURNING *`;
  const params = Object.values(user);

  const results = await db.query(sql, params);
  return res.status(201).send(results.rows[0]);
});

const editUser = errorHandler(
  'Error editing user. Try again later.',
  400
)(async (req, res) => {
  const { body, params, user } = req;
  const id = parseInt(params.id, 10);

  if (body.permission && user.permission !== 'admin') {
    throw new HttpError(
      'You cannot change your own permissions unless you are an administrator.',
      500
    );
  }

  const newUser = await User.userBeforeSave({ ...body, id });

  const keys = Object.values(newUser);
  const values = Object.keys(newUser)
    .map((k, i) => `${k} = $${i + 1}`)
    .join(', ');

  const sql = `UPDATE users SET ${values} WHERE id = $${keys.length + 1}`;
  const sqlParams = [...keys, id];

  await db.query(sql, sqlParams);

  res.status(200).send({ ...newUser, password: null, refresh_id: null });
});

const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.query('DELETE FROM users WHERE id = $1', [id]);
  res.status(200).send({ success: 'success' });
};

// Non rest-routes

// View logged in user profile, requires middleware
const me = async (req, res) => {
  const { id, email, name, permission } = req.user;
  res.send({ id, email, name, permission });
};

// Log user out of all devices (changes the refresh_id of the user)
const logoutall = async (req, res) => {
  // const { id, email, name, permission } = req.user;
  res.send({ success: 'success' });
};

// Log user out of the application
const logout = async (req, res) => {
  res.send({ success: 'success' });
};

const login = errorHandler(
  'Logging in failed, please try again later.',
  401
)(async (req, res) => {
  // Login a registered user
  const { email, password } = req.body;
  console.log('{ email, password }');

  console.log({ email, password });

  const user = await User.findByCredentials(email, password);
  const token = User.generateAuthToken(user);
  const { id, name, permission } = user;

  res.cookie('token', token, { httpOnly: true });

  res.send({
    user: {
      id,
      name,
      permission,
      email,
    },
  });
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  editUser,
  deleteUser,
  me,
  logout,
  logoutall,
  login,
};
