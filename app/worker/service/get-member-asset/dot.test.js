require('dotenv').config();
require('rootpath')();
let expect = require('chai').expect;

describe('Test DOT get methods', function () {
  this.timeout(60000);

  beforeEach((done) => {
    require('server');
    setTimeout(done(), 5000) ;
  });

  it('Constructor', async () => {
    const DOT = require('./dot');
    let dot = new DOT();
    const result = await dot.get('5HQGHHrz1DMhCP8UkoqJieTRw7KHTjRjLyCujDvu8fPJm5gu');
    console.log(result);
  });
});
