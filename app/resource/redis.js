const config = require('app/config');
const keys = {
  stakingApi: {
    token: `${config.redis.prefix}:stakingapi:token`,
  },
};

String.prototype.withParams = function (...params) {
  let str = this;
  if (params && params.length > 0) {
    params.forEach(item => {
      str += ':' + item;
    });
  }

  return str;
};

module.exports = Object.assign({}, keys); 