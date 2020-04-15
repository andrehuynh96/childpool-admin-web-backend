const config = require("app/config");
const key = require('app/lib/staking-api/key');

module.exports = async function (req, res, next) {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token && (token.startsWith("bearer ") || token.startsWith("bearer "))) {
    token = token.slice(7, token.length);
  }
  else {
    return res.unauthorized();
  }

  if (token) {
    try {
      var legit = await key.verifySignature(token);
      req.user = legit;
      return next();
    } catch (err) {
      return res.unauthorized();
    }
  }
}
