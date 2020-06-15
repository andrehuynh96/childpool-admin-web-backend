let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../server.js');
let should = chai.should();


chai.use(chaiHttp);
describe('order', () => {
    beforeEach((done) => { //Before each test we empty the database
        setTimeout(function(){
            done()
        }, 5000)
    });
/*
  * Test the /GET route
  */
  describe('/GET orders', () => {
      it('it should GET all the orders', (done) => {
        chai.request(server)
            .get('/web/orders')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });

});