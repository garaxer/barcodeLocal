// https://codeburst.io/authenticated-testing-with-mocha-and-chai-7277c47020b7
const { assert } = require('chai');
const { expect } = require('chai');
const request = require('supertest');

const app = require('../index.js');

const userCredentials = {
  email: 'testuser@gaz.com.au',
  password: 'test123!',
};

let token = null;

const authenticatedUser = request.agent(app);

before((done) => {
  authenticatedUser
    .post('/api/users/login')
    .send(userCredentials)
    .end((err, response) => {
      expect(response.statusCode).to.equal(200);
      // expect('Location', '/home');
      response.body.should.be.a('object');
      response.body.token.should.be.a('string');
      token = response.body.token;

      done();
    });
});

describe('GET /api/users/me', () => {
  // Authed, 403
  it('should return a 200 response if the user is logged in', (done) => {
    request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, done);
  });
  // Not authed, 403
  it('should return a 403', (done) => {
    request(app).get('/api/users/me').expect(403, done);
  });
});

describe('GET /api/users', () => {
  // get users
  it('should return a full list of users', (done) => {
    request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        assert.isNotEmpty(res.body);
        res.body.should.be.a('array');
        done();
      });
  });
});
