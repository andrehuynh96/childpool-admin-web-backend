const _ = require('lodash');
const CryptoJS = require("crypto-js");
const config = require('app/config');

const secret = config.crypto.secret;

const cryptoHelper = {
  encrypt(text) {
    const cipherText = CryptoJS.AES.encrypt(text, secret).toString();

    return cipherText;
  },
  decrypt(cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, secret);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    return originalText;
  },

};

module.exports = cryptoHelper;
