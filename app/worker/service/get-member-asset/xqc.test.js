require('dotenv').config();
require('rootpath')();

describe('Test XQC get methods', function () {
  this.timeout(60000);

  beforeEach((done) => {
    require('server');
    setTimeout(done(), 5000) ;
  });

  it('Constructor', async () => {
    const XQC = require('./xqc');
    let xqc = new XQC();
    const result = await xqc.get('DnydeYy3FETqXEWUo92Tq9qYpfJ7CSt7PT');
    console.log(result);
  });
});
