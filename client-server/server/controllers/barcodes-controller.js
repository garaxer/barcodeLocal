const db = require('../db');
const HttpError = require('../models/http-error');
const { errorHandler } = require('../models/http-error');
const Barcode = require('../models/Barcode');
const { parseFilter } = require('../util');

/**
 * Gets barcodes, accepts query parameters.
 *If the current user is not admin force their id to be in the filter
 * @param {query: {}} req
 * @param {*} res
 */
const getBarcodes = errorHandler(
  'Getting barcodes has failed. Try again later.',
  400
)(async (req, res) => {
  const { query } = req;

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
    const { rows } = await db.query('SELECT * FROM barcodes', []);
    return res.status(200).json(rows);
  }

  // Handle no range with a default
  const [rangeStart, rangeEnd] = range
    ? [parseInt(range[0], 10), parseInt(range[1], 10)]
    : [0, 5];

  // Sanitize order options
  const orderOptions = (s) =>
    ['ID', 'bnumber', 'bprefix', 'createdAt', 'creator_id'].includes(s)
      ? s
      : 'ID';
  const orderingOptions = (s) =>
    ['ASC', 'DESC'].includes(s.toUpperCase()) ? s : 'ASC';

  // Sanitize sort options
  const [orderBy, ordering] = sort
    ? [orderOptions(sort[0]), orderingOptions(sort[1])]
    : [null, null];

  // If the user is not an administrator, filter the results by their id
  const filterObj =
    req.user.permission.toString() === 'admin'
      ? filter
      : { ...filter, creator_id: req.user.id };
  // create query string from filters. Add +3 to account for limits

  const [filterSql, filterParams] = filterObj ? parseFilter(filter) : ['', []];

  // Don't limit if -1 is passed in range
  const shouldntLimit = rangeEnd === -1;
  const limitSql = shouldntLimit
    ? ''
    : `limit $${filterParams.length + 1} offset $${filterParams.length + 2}`;
  const limitParams = shouldntLimit ? [] : [rangeEnd - rangeStart, rangeStart];

  const orderSql = orderBy ? `ORDER BY ${orderBy} ${ordering}` : '';

  const sql = `SELECT * FROM barcodes ${filterSql} ${orderSql} ${limitSql}`;

  const params = [...filterParams, ...limitParams];
  console.log(sql, params);
  const results = await db.query(sql, params);

  // Get the total records and add it to the header

  const countResults = await db.query(
    `select COUNT(*) from barcodes ${filterSql};`,
    filterParams
  );
  console.log(`select COUNT(*) from barcodes ${filterSql};`, filterParams);
  const { count } = countResults.rows[0];
  res.setHeader('content-range', `${rangeStart}-${rangeEnd}/${count}`);
  console.log(`${rangeStart}-${rangeEnd}/${count}`);
  return res.status(203).json(results.rows);
});

/**
 * Using the id from params and add a new barcode with the contents from req.body
 * req.body: {bprefix: string, creator_id: int} e.g {"bprefix": "AP","creator_id": 20}
 * The bnumber will be found by getting the latest.
 */
const createBarcode = errorHandler(
  'Creating a barcode has failed. Try again later.',
  400
)(async (req, res) => {
  const barcode = req.body;
  const bnumber = await Barcode.findNewestByPrefix(barcode.bprefix);
  const newBarcode = { ...barcode, bnumber };

  const keys = Object.keys(newBarcode).join(', ');
  const values = Object.keys(newBarcode)
    .map((_, i) => `$${i + 1}`)
    .join(', ');
  const sql = `INSERT INTO barcodes (${keys}) VALUES (${values}) RETURNING *`;
  // Can flat map this if I want each field to have an array of values to insert.
  const params = Object.values(newBarcode);

  console.log(sql);
  console.log(params);

  const results = await db.query(sql, params);
  return res.status(201).send(results.rows[0]);
});

/**
 * Using the id from params and the changes in req.body edit the barcode with the id
 * Should only ever need to change the user who created it.
 */
const editBarcode = errorHandler(
  'Error editing barcode. Try again later.',
  400
)(async (req, res) => {
  const { body: barcode, params } = req;
  const id = parseInt(params.id, 10);

  const keys = Object.values(barcode);
  const values = Object.keys(barcode)
    .map((k, i) => `${k} = $${i + 1}`)
    .join(', ');

  const sql = `UPDATE users SET ${values} WHERE id = $${keys.length + 1}`;
  const sqlParams = [...keys, id];

  await db.query(sql, sqlParams);

  res.status(200).send({ ...barcode, password: null, refresh_id: null });
});

const getBarcode = async (req, res) => {
  const { id } = req.params;
  const { rows } = await db.query('SELECT * FROM barcodes WHERE id = $1', [id]);
  res.send(rows[0]);
};

const deleteBarcode = errorHandler(
  'Failed deleting barcode',
  400
)(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.query('DELETE FROM barcodes WHERE id = $1', [id]);
  res.status(200).send({ success: 'success' });
});

// Not rest routes.

/**
 * Given a req.body containing the prefix and the count,
 * req.body: {bprefix: string, count: int} e.g {"bprefix": "AP","count": 10}
 * create count barcodes in the database that have the latest incremented number
 * Responds with the new barcodes labels inserted into the database.
 */
const createLatestBarcodes = errorHandler(
  'Failed creating new barcodes',
  400
)(async (req, res) => {
  // Set the latest barcode numbers, in batch set by count
  //  "bprefix": "AP",
  //  "count": 5
  console.log('Setting multiple barcodes via post');
  const { bprefix, count } = req.body;

  // For now only allow a max of 10 barcodes a hit
  const checkLessThanOne = (n) => (n < 1 ? 1 : n);
  const onlyTen = (n) => (n > 10 ? 10 : n);
  const countTen = checkLessThanOne(onlyTen(parseInt(count, 10)));

  // Get the latest barcodes number in the series
  // TODO: Replace the below by adding a trigger to the database that increments the specified bprefix or have seperate tables for prefixes
  const latest = await Barcode.findNewestByPrefix(bprefix);
  const bnumbers = [...Array(countTen)].map((_, i) => latest + i);

  const barcodeLabels = bnumbers.map((n) => `${bprefix}${n}`);

  const barcodeArray = bnumbers.map((bnumber) => [
    bprefix,

    bnumber,
    req.user.id,
  ]);

  // Changes [[a,b],[a,b]] to [[1,2],[3,4]]
  const change2DArrayToCount = (foo) =>
    foo.map((xs, i) =>
      xs.map((a, j) => j + 1 + foo.slice(0, i).flat().length, [])
    );
  // Changes [[1,2],[3,4]] to $1, $2), ($3, $4
  const values = change2DArrayToCount(barcodeArray)
    .map((arr) => arr.map((x) => `$${x}`).join(', '))
    .join('), (');

  const sql = `INSERT INTO barcodes (bprefix, bnumber, creator_id) VALUES (${values}) RETURNING *`;
  const params = barcodeArray.flat();
  const results = await db.query(sql, params);
  if (!results) {
    throw new HttpError('Error inserting new barcodes, please try again later');
  }

  res.status(200).send({ barcodeLabels });
});

module.exports = {
  getBarcode,
  getBarcodes,
  createBarcode,
  editBarcode,
  deleteBarcode,
  createLatestBarcodes,
};
