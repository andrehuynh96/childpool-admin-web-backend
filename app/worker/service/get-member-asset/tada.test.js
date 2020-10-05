require('dotenv').config();
require('rootpath')();
const ADA = require('./tada');
let expect = require('chai').expect;

describe('Test ADA get methods', function () {
  this.timeout(60000);

  beforeEach((done) => {
    require('server')
    setTimeout(done(), 5000) 
  })

  it('Constructor', async () => {
    let ada = new ADA()
    ada.setValidators(['237795878bfa5352cca325012e073b344ce337a1dd752cd3d5ea4cdc'])
    await ada.get('addr1q85j6k40ezt58dzp67dkelrqpm2e8ghnp664t0r6chc0nltun3lw37skprm0w3zhmp33ql35xeq82s9kvtn9ycq3lcps3hl8hl')
    // await ada.get('addr1qxv0jfsyzt9kp6nyp026xqfwr2gglv8cjr0r8fnpd3nqm5lwz8pd3q3kegvtxv3pv2ecggtsvdfntf89qg0qy7g0rvlq52nztn')
    // await ada.get('addr1q87q0k3q05gq48veesrz2z0cfgx5ru6fwkhnx3vpwm8va7mm3frj4vwws7cu0fpce6gqev0pca4cn0x9cq7r89wf2h4q9neh4f')
  });
})