const express = require('express');

const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const wkhtmltopdf = require('wkhtmltopdf');

const { connect } = require('./db');
const HttpError = require('./models/http-error');

const mountRoutes = require('./routes');
const mountInit = require('./routes/init'); // Use only in dev

const port = process.env.PORT || 3000;

const app = express();
// Access-Control-Expose-Headers https://expressjs.com/en/resources/middleware/cors.html

app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
    ],
    credentials: true,
    exposedHeaders: [
      'X-Content-Range',
      'Content-Range',
      'content-range',
      'X-CSRF-Token',
      'x-csrf-token',
    ],
  })
);
app.use(express.json());

// app.use(express.static(path.join(__dirname, 'util', 'files')));

app.get('/testpdf', (req, res) => {
  const options = {
    output: `asd.pdf`,
    pageHeight: '25mm',
    pageWidth: '50mm',
    marginTop: '0cm',
    marginBottom: '0cm',
    marginLeft: '0cm',
    marginRight: '0cm',
  };
  const stream = wkhtmltopdf('https://www.google.com/', options);
  res.set('Content-Disposition', 'attachment; filename=transcript.pdf');
  res.set('Content-Type', 'application/pdf');
  stream.pipe(res);
});

mountInit(app);

app.use(csrf({ cookie: true }));
mountRoutes(app);

// Handle 404
app.use(() => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

// Handle error
app.use((error, req, res, next) => {
  // Handle JWT error
  console.error('error.name:', error.name);

  if (error.name === 'UnauthorizedError') {
    console.log('error.code');

    console.log(error.code);
    console.log(error.message);
    const messages = {
      'jwt expired': 'Session expired',
      'No authorization token was found': 'No authorization token was found',
    };

    return res.status(401).send({
      error: `Error - Unauthorized. ${messages[error.message] || ''}`,
    });
  }
  // Handle CSRF error
  if (error.code === 'EBADCSRFTOKEN') {
    console.log('Invalid csrf');
    return res
      .status(500)
      .json({ error: 'Error - Unauthorized - Invalid CSRF Token' });
  }
  console.error('returning:', error.message);
  return res.headerSent
    ? next(error)
    : res
        .status(error.code || 500)
        .json({ error: error.message || 'An unknown error occurred!' });
});

// Test the connection before starting the server
connect((err, client, release) => {
  if (err) {
    return console.error(
      '##FAILED TO CONNECT TO PG DB### \n Error acquiring client',
      err.stack,
      '\n FAILED TO CONNECT TO PG DB - check auth and env file'
    );
  }
  app.listen(port, (e) =>
    console.log(`Listening ${port}: ${e || 'Server Running'}`)
  );
  return client.query('SELECT NOW()', (error, result) => {
    release();
    if (error) {
      return console.error('Error executing query', error.stack);
    }
    return console.log(result.rows);
  });
});

// Export our app for testing purposes
module.exports = app;
