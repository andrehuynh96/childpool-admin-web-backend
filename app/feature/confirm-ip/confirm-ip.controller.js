const logger = require('app/lib/logger');
const UserIps = require("app/model/wallet").user_ips;
const UserOTP = require("app/model/wallet").user_otps;

module.exports = async (req, res, next) => {
  try {
    let user_otp = await UserOTP.findOne({
      where: {
        code: req.body.verify_token,
        action_type: OtpType.TWOFA
      }
    });
    if (!user_otp) {
      return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID", { fields: ["verify_token"] });
    }
    let today = new Date();
    if (user_otp.expired_at < today || user_otp.expired || user_otp.used) {
      return res.badRequest(res.__("TOKEN_EXPIRED"), "TOKEN_EXPIRED", { fields: ['verify_token'] });
    }

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