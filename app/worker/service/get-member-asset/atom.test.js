require('dotenv').config();
require('rootpath')();
let expect = require('chai').expect;

describe('Test IRIS get methods', function () {
  this.timeout(60000);

  beforeEach((done) => {
    require('server')
    setTimeout(done(), 5000) 
  })

  it('Constructor', async () => {
    const ATOM = require('./atom');
    let atom = new ATOM()
    atom.get('cosmos103hln939qnwzuj0nhflg0jh8m8v9akvmm3p0t7')
  });
})