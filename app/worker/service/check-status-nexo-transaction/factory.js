const Provider = require("./provider");
const types = {
  [Provider.Nexo]: require("./nexo")
};

module.exports = {
  create: (type, params = {}) => {
    if (types[type]) {
      return new types[type](params);
    }
    throw new Error(`Not support ${type}`);
  }
};
