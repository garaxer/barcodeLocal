const User = require('../models/User');
const db = require('../db');

module.exports = (app) => {
  app.get('/init', async (req, res) => {
    const initSql = `drop table IF EXISTS barcodes;
    drop table IF EXISTS users;
    drop table IF EXISTS company;
    
    CREATE TABLE company (
      ID SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      createdAt timestamp default current_timestamp
    );
    
    CREATE TABLE users (
      ID SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) NOT NULL UNIQUE,
      permission VARCHAR(255),
      password VARCHAR(255) NOT NULL,
      company_id INTEGER REFERENCES company(ID),
      refresh_id VARCHAR(255),
      disabled VARCHAR(30),
      createdAt timestamp default current_timestamp
    );
    
    CREATE TABLE barcodes (
      ID SERIAL PRIMARY KEY,
      bnumber INTEGER NOT NULL,
      bprefix VARCHAR(255) NOT NULL,
      creator_id INTEGER REFERENCES users(ID),
      createdAt timestamp default current_timestamp
    );`;

    await db.query(initSql);

    const user = await User.userBeforeSave({
      name: 'test',
      email: 'test@test.test',
      password: 'test123!',
      permission: 'admin',
    });

    const sql = `INSERT INTO users (name, email, password, permission, refresh_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
    const params = Object.values(user);

    console.log(sql);
    console.log(params);

    const results = await db.query(sql, params);
    return res.status(201).send(results.rows[0]);
  });
};
/*  const User = require('../models/User');
const db = require('../db');
const { parseFilter } = require('../util');
  //app.get('/init', async (req, res) => {
  //  const user = await User.userBeforeSave({
  //    name: 'gary',
  //    email: 'gary2@gary.gary',
  //    password: 'gary123!',
  //    permission: 'admin',
  //  });
  //  const sql = `INSERT INTO users (name, email, password, permission, refresh_id) //VALUES ($1,$2,$3,$4,$5) RETURNING *`;
  //  const params = Object.values(user);
  //
  //  console.log(sql);
  //  console.log(params);
  //
  //  const results = await db.query(sql, params);
  //  return res.status(201).send(results.rows[0]);
  //});

  // http://localhost:8080/api/users?filter=%7B%22id%22%3A%5B1%2C20%5D%7D
  // http://localhost:8080/test?filter={"id":[1,20],"name":"Gary"}
  app.get('/test', async (req, res) => {
    const { query } = req;

    const queryParams = Object.keys(query).reduce(
      (a, c) => ({ ...a, [c]: (() => JSON.parse(query[c]))() }),
      {}
    );

    const { sort, range, filter } = queryParams;

    // Handle no parameters
    if (![sort, range, filter].some((x) => x)) {
      const results = await db.query('SELECT * FROM users ORDER BY id ASC');
      return res.status(200).json(results.rows);
    }

    const [filterSql, filterParams] = filter ? parseFilter(filter) : ['', ''];
    console.log(filterSql, filterParams);

    const sql = `SELECT * FROM users ${filterSql} `;

    const params = [...filterParams];
    console.log(sql, params);
    res.send(sql);
  }); */
