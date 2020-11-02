const Provider = require("./provider");
const types = {
  [Provider.Wyre]: require("./wyre")
}

module.exports = {
  create: (type, params) => {
    if (types[type]) {
      return new types[type](params);
    }
    throw new Error(`Not support ${type}`);
  }
}