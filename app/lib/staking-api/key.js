const config = require("app/config");
const jwksClient = require('jwks-rsa');
const jwt = require("jsonwebtoken");

var pubKey = ""

module.exports = {
  getPubkey: function () {
    if (pubKey)
      return pubKey
    const client = jwksClient({
      strictSsl: false, // Default value
      jwksUri: config.jwksUri,
      requestHeaders: {}, // Optional
      requestAgentOptions: {} // Optional
    });

    const kid = config.kid;

    return new Promise((resolve, reject) => {
      client.getSigningKey(kid, (err, key) => {
        if (err)
          return reject(err)
        const signingKey = key.publicKey || key.rsaPublicKey;
        return resolve(signingKey)
      });
    })
  },
  verifySignature: async function (token) {
    let mypubKey = await this.getPubkey()
    return jwt.verify(token, mypubKey);
  }
};
