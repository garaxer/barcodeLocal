const jwt = require('express-jwt');

const users = require('./users-routes');
const companies = require('./companies-routes');
const barcodes = require('./barcodes-routes');
const fileGenerator = require('./fileGenerator-routes');

/**
 * Adds routes to the express app.
 * @param {Express} app:Express
 */
module.exports = (app) => {
  app.get('/', (req, res) => res.send('Running... pg db'));

  app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });

  // Another way instead of doing this is to use the auth middle ware
  app.use(
    jwt({
      secret: process.env.JWT_KEY,
      algorithms: ['HS256'],
      getToken: (req) => req.cookies.token,
    }).unless({ path: ['/', '', '/api/users/login'] })
  );

  app.use('/api/users', users);
  app.use('/api/barcodes', barcodes);
  app.use('/api/companies', companies);
  app.use('/api/generate', fileGenerator);
};
