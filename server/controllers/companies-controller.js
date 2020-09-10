const db = require('../db');
const HttpError = require('../models/http-error');
const { errorHandler } = require('../models/http-error');
const Company = require('../models/Company');

const createCompany = errorHandler(
  'Creating companies failed. Try again later.',
  400
)(async (req, res) => {
  console.log(req.body);
  if (!req.body.name) {
    throw new HttpError('No name in create company body');
  }
  const company = await Company.companyBeforeSave(req.body);
  console.log(req.body);

  const keys = Object.keys(company).join(', ');
  const values = Object.keys(company)
    .map((_, i) => `$${i + 1}`)
    .join(', ');
  const sql = `INSERT INTO company (${keys}) VALUES (${values}) RETURNING *`;
  const params = Object.values(company);

  console.log(sql);
  console.log(params);

  const results = await db.query(sql, params);
  return res.status(201).send(results.rows[0]);
});

// Non rest-routes

// View company
//const getCompany = async (req, res) => {
//  const { id, name, timestamp } = req.company;
//  res.send({ id, name, timestamp });
//};

const getCompany = errorHandler(
  'Getting company failed. Try again later.',
  400
)(async (req, res) => {
  const { id } = req.params;
  const {
    rows,
  } = await db.query('SELECT id, name, timestamp FROM company WHERE id = $1', [
    id,
  ]);
  res.send(rows[0]);
});

const getCompanies = errorHandler(
  'Getting companies failed. Try again later.',
  400
)(async (req, res) => {
  const { query } = req;

  /**
   * Gets companies, handles the following parameters
   */
  // http://localhost:8080/api/companies?sort=["name","DESC"]&range=[0, 3]&filter={"name":"gary"}

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
  if (!(sort || range || filter)) {
    const results = await db.query('SELECT * FROM company ORDER BY id ASC');
    return res.status(200).json(results.rows);
  }

  // Handle no range
  const [rangeStart, rangeEnd] = range
    ? [parseInt(range[0], 10), parseInt(range[1], 10)]
    : [0, 5];

  // Sanitize order options
  const orderOptions = (s) =>
    ['ID', 'name', 'timestamp'].includes(s) ? s : 'ID';
  const orderingOptions = (s) => (['ASC', 'DESC'].includes(s) ? s : 'ASC');

  // Sanitize sort options
  const [orderBy, ordering] = sort
    ? [orderOptions(sort[0]), orderingOptions(sort[1])]
    : [null, null];

  // create query string from filters. Add +3 to account for limits
  const filters = filter ? Object.values(filter).flatMap((x) => x) : [];
  const filterString =
    filter &&
    Object.keys(filter)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(' and ');

  // Don't limit if -1 is passed in as a limit
  const shouldntLimit = rangeEnd === -1;
  const limitSql = shouldntLimit
    ? ''
    : `limit $${filters.length + 1} offset $${filters.length + 2}`;
  const limitParams = shouldntLimit ? [] : [rangeEnd - rangeStart, rangeStart];

  const orderSql = orderBy ? `ORDER BY ${orderBy} ${ordering}` : '';

  const sql = `SELECT * FROM companies ${
    filters.length ? `WHERE ${filterString}` : ''
  } ${orderSql} ${limitSql}`;

  const params = [...filters, ...limitParams];
  console.log(sql, params);
  const results = await db.query(sql, params);
  return res.status(200).json(results.rows);
});

const editCompany = errorHandler(
  'Error editing company. Try again later.',
  400
)(async (req, res) => {
  const { body, params } = req;
  const id = parseInt(params.id, 10);

  const newCompany = await Company.companyBeforeSave({ ...body, id });

  const keys = Object.values(newCompany);
  const values = Object.keys(newCompany)
    .map((k, i) => `${k} = $${i + 1}`)
    .join(', ');

  const sql = `UPDATE company SET ${values} WHERE id = $${keys.length + 1}`;
  const sqlParams = [...keys, id];

  await db.query(sql, sqlParams);

  res.status(200).send({ ...newCompany, password: null, refresh_id: null });
});

const deleteCompany = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.query('DELETE FROM company WHERE id = $1', [id]);
  res.status(200).send({ success: 'success' });
};

module.exports = {
  createCompany,
  getCompany,
  getCompanies,
  editCompany,
  deleteCompany,
};
