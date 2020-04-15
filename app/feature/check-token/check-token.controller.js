const logger = require('app/lib/logger');
const User = require("app/model/wallet").users;
const OTP = require("app/model/wallet").user_otps;

module.exports = async (req, res, next) => {
  try {
    let otp = await OTP.findOne({
      where: {
        code: req.params.token,
      }
    });
    if (!otp) {
      return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID");
    }

    let today = new Date();
    let tokenStatus = "VALID";
    if (otp.expired_at < today || otp.expired) {
      tokenStatus = "EXPIRED";
    }
    if (otp.used) {
      tokenStatus = "USED";
    }
    let user = await User.findOne({
      where: {
        id: otp.user_id
      }
    });
    if (!user) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
    }

    return res.ok({
      token_sts: tokenStatus,
      user_sts: user.user_sts
    });
  }
  catch (err) {
    logger.error("checktoken fail: ", err);
    next(err);
  }
}; 