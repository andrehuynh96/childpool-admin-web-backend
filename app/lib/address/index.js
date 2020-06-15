const bech32 = require("bech32");
const WAValidator = require("wallet-address-validator");
const NeonCore = require('@cityofzion/neon-core');

module.exports = {
  validate: (platform, address) => {
    let valid = false;
    if (platform == "ATOM") {
      valid = _verifyCosmosAddress(address);
    } else if (platform == "IRIS") {
      valid = _verifyIrisAddress(address);
    } else if (platform == "ONT" || platform == "ONG") {
      valid = _verifyOntAddress(address);
    } else {
      valid = WAValidator.validate(address, platform, "testnet");
      valid = valid ? true : WAValidator.validate(address, platform);
    }

    return valid;
  }
}

function _verifyCosmosAddress(address) {
  try {
    let result = bech32.decode(address.toLowerCase());
    return result.prefix == "cosmos";
  } catch (e) {
    logger.error(e);
    return false;
  }
}

function _verifyIrisAddress(address) {
  try {
    let result = bech32.decode(address.toLowerCase());
    return result.prefix == "iaa";
  } catch (e) {
    logger.error(e);
    return false;
  }
}

function _verifyOntAddress(address) {
  try {
    return NeonCore.wallet.isAddress(address);
  } catch (e) {
    logger.error(e);
    return false;
  }
}
