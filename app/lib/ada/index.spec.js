/*eslint no-process-env: "off"*/
require('dotenv').config();
require('rootpath')();
const Index = require("./index");
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
chai.should();

const validators = ["pool1kcnh9avc9jgelajcja7y6wsvjdaulkqj02azcszjvm3pwmksr0l"];
const delegators = ["stake1uynm03a7sdwhe4ey3v2paepw4t5tpx4us2ad0hwxpy7xrkq2dufad"];
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

  it('get Current Epoch', async () => {
    let result = await Index.getCurrentEpoch();
    console.log(JSON.stringify(result));
  });

  it.only('get Active Stake Address', async () => {
    let currentEpoch = await Index.getCurrentEpoch();
    let result = await Index.getActiveStakeAddress({
      validators,
      epoch: currentEpoch,
      limit: 10,
      delegators
    });
    console.log(JSON.stringify(result));
  });
});