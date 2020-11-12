/*eslint no-process-env: "off"*/
require('dotenv').config();
require('rootpath')();
const sleep = require('sleep-promise');
const redis = require('app/lib/redis');
const NEXO = require("./nexo");
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
chai.should();

let instance;
const nexoId = '5fab8591de111a217326fc9a';
const secret = 'f3876290332190a985d42c400b78db5483942abc54b32d03d298fd56a4c19c641731812322b88906bbb3a54d8230074883bdcf585e822c6e50edbfbd9cf15050';
const VerifyCode = '36132006';

// const nexoId = '5fa90d3bde111a217326fc7f';
// const secret = '15466502b28e9f2b619cbc7b1ff61b1a4e5a7be7ac1e59da4987ab41fb43e6a2b39e435b0c85d252e98dd849510cb4fcf028c6696974dffb0dab5123dcff6591'
// const VerifyCode = '68536443';

const nexoEmail = "huyht+1604914489519@blockchainlabs.asia";
const currencyId = 'NXTcJinsNucsB'//BTC: 'NXTcJinsNucsB';
const walletAddress = 'mxSb3XcRUURLthzA4GFvzyTu1jK5Uro4kS';

describe('Test NEXO', function (done) {
  beforeEach(async () => {
    redis.init(async err => {
    });
    // await sleep(2000);
    instance = new NEXO({ ibp: true });
  });

  it('Create account', async () => {
    let time = Date.now();
    let email = `myhn@gmailup.com`;
    let result = await instance.createAccount({
      first_name: "My",
      last_name: "Huynh",
      email: email
    });
    console.log(result);
    result.should.have.property('id');
    result.should.have.property('secret');
  });

  it('Verify account', async () => {
    let result = await instance.verifyEmail({
      nexo_id: nexoId,
      code: VerifyCode,
      secret: secret
    });
    console.log('Verify account::', result);
    assert.typeOf(result, 'array');
  });

  it('requestRecoveryCode account', async () => {
    let result = await instance.requestRecoveryCode({
      email: nexoEmail
    });
    console.log('requestRecoveryCode account::', result);
    assert.typeOf(result, 'array');
  });

  it('verifyRecoveryCode account', async () => {
    let result = await instance.verifyRecoveryCode({
      email: nexoEmail,
      code: '73327107'
    });
    console.log('verifyRecoveryCode account::', result);
    result.should.have.property('id');
    result.should.have.property('secret');
  });

  it('getBalance', async () => {
    let result = await instance.getBalance({
      nexo_id: nexoId,
      secret: secret
    });
    console.log('getBalance::', result);
    // [
    //   {
    //     id: 'NXTcJinsNucsB',
    //     name: 'BTC',
    //     interest_rate: 4,
    //     interest_earned: '0.00000000',
    //     amount: '0.00000000',
    //     min_earnable: '0.001',
    //     deposit_enabled: true,
    //     withdraw_enabled: true
    //   },
    // {
    //   id: 'NXTYMFU8gS7vM',
    //   name: 'USDT',
    //   interest_rate: 8,
    //   interest_earned: '0.00000000',
    //   amount: '0.00000000',
    //   min_earnable: '1',
    //   deposit_enabled: true,
    //   withdraw_enabled: true
    // },
    // ]
  });

  it('getDepositAddress account', async () => {
    let result = await instance.getDepositAddress({
      nexo_id: nexoId,
      secret: secret,
      currency_id: currencyId
    });
    console.log('getDepositAddress::', result);
    result.should.have.property('address');
    result.should.have.property('status');
    // {
    //   status: 'ready',
    //   address: '2N8TDLdRi77SdnRYEcjPyPtyReL3Lq5w6YA',
    //   tag: null,
    //   short_name: 'BTC'
    // }
  });

  it('withdraw account', async () => {
    let result = await instance.withdraw({
      nexo_id: nexoId,
      secret: secret,
      currency_id: currencyId,
      amount: 0.001,
      wallet_address: walletAddress
    });
    console.log('withdraw::', result);
    result.should.have.property('address');
    result.should.have.property('status');
  });

  it.only('withdraw transaction', async () => {
    let result = await instance.getWithdrawTransactions({
      nexo_id: nexoId,
      secret: secret
    });
    console.log('withdraw transaction::', result);
    assert.typeOf(result, 'array');
  }).timeout(5000);

});
