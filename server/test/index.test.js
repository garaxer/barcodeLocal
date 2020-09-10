// const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../index.js');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('index.js', () => {
  it('Handles 404 routes', (done) => {
    chai
      .request(app)
      .get('/UNKNOWNROUTE')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        done();
      });
  });
});
