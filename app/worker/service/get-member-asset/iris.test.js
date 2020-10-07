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
    const IRIS = require('./iris');
    let iris = new IRIS()
    iris.get('iaa1a6junpsftkd7peztvr98hgvvmj3jtf8f4rnlec')
  });
})