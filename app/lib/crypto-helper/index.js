const _ = require('lodash');
const SimpleAes = require('simple-aes-256');
const config = require('app/config');

const secret = config.crypto.secret;

const cryptoHelper = {
  encrypt(text) {
    const result = SimpleAes.encrypt(secret, text);

    return Buffer.from(result).toString('base64');
  },
  decrypt(encryptedText) {
    const encryptedBlock = Buffer.from(encryptedText, 'base64');
    const decrypted = SimpleAes.decrypt(secret, encryptedBlock);

    return decrypted.toString();
  },

};

module.exports = cryptoHelper;
