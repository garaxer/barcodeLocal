const db = require('../db');

/**
 * Given a prefix of a barcode return the largest number in the series.
 * @param {string} bprefix The prefix of the barcode you want to search by.
 * @returns {int} the latest barcode number
 * TODO: This won't be needed if I add a trigger or seperate tables to the database that autoincrements the specified prefix.
 */
const findNewestByPrefix = async (bprefix) => {
  const results = await db.query(
    'select * from barcodes where bprefix = $1 ORDER BY bnumber DESC limit 1',
    [bprefix]
  );

  if (!results.rows.length) {
    return 0;
  }
  const barcode = results.rows[0];
  return barcode.bnumber + 1;
};

module.exports = {
  findNewestByPrefix,
};
