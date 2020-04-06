const logger = require('app/lib/logger');
const UserIps = require("app/model/wallet").user_ips;

module.exports = async (req, res, next) => {
  try {
    let userIp = await UserIps.findOne({
      where: {
        allow_flg: false,
        verify_token: req.body.verify_token
      }
    })
    if (!userIp) {
      return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID", { fields: ["verify_token"] });
    }
    else {
      await userIp.update({
        allow_flg: true
      }, {
          where: {
            allow_flg: false,
            verify_token: req.body.verify_token
          }
        })
      return res.ok(true);
    }
  }
  catch (err) {
    logger.error("create new user_ip fail", err);
  }
};