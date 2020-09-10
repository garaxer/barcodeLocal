const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/barcode.db');

const getStuff = () => {
  const sql = 'select * from users;';

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row.name);
    });
  });
};

module.exports = {
  query: (sql, params) =>
    new Promise(function (resolve, reject) {
      db.all(sql, params, function (error, rows) {
        if (error) reject(error);
        else resolve({ rows });
      });
    }),
  getStuff,
};
