/*eslint no-process-env: "off"*/
require('dotenv').config();
require('rootpath')();
const Index = require("./index");
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
chai.should();

const validators = ["pool1a6v2wt0m8wjra80zuw00sfdxn4w52cna96gcaglzvred6gnsusx"];
const delegators = ["stake1u9dacfk3amxfuh2tldj474ezpwxa3g35dwnegqte4m3xlqgsdmcen"];
const txId = "d4c12606b0fbdb46c401f1799454314fc67859429e4f7858ca8f40fc56e26821";
const epoch = 231;

describe('Test ADA', function () {
  it('Get best block', async () => {
    let result = await Index.getLatestBlock();
    console.log(result);
    result.should.have.property('hash');
  });

  it('get Transaction Detail', async () => {
    let bestBlock = await Index.getLatestBlock();
    let result = await Index.getTransactionDetail({
      address: delegators[0],
      until_block: bestBlock.hash
    });
    console.log(result);
    expect(result).to.be.an('array')
  });

});