const logger = require('app/lib/logger');
const User = require("app/model/wallet").users;
const UserStatus = require("app/model/wallet/value-object/user-status");
const OTP = require("app/model/wallet").user_otps;
const OtpType = require("app/model/wallet/value-object/otp-type");
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = async (req, res, next) => {
  try {
    let otp = await OTP.findOne({
      where: {
        code: req.body.verify_token,
        action_type: { [Op.in]: [OtpType.FORGOT_PASSWORD, OtpType.CREATE_ACCOUNT] }
      }
    });
    if (!otp) {
      return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID", { fields: ["verify_token"] });
    }

    let today = new Date();
    if (otp.expired_at < today || otp.expired || otp.used) {
      return res.badRequest(res.__("TOKEN_EXPIRED"), "TOKEN_EXPIRED");
    }

    let user = await User.findOne({
      where: {
        id: otp.user_id
      }
    });
    if (!user) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
    }

    if (user.user_sts == UserStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT", "UNCONFIRMED_ACCOUNT"));
    }

    if (user.user_sts == UserStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED", "ACCOUNT_LOCKED"));
    }

    let passWord = bcrypt.hashSync(req.body.password, 10);
    let [_, response] = await User.update({
      password_hash: passWord,
    }, {
        where: {
          id: user.id
        },
        returning: true
      });
    if (!response || response.length == 0) {
      return res.serverInternalError();
    }

    // mark this otp as USED after setting new password
    await OTP.update({
      used: true
    }, {
        where: {
          user_id: user.id,
          code: req.body.verify_token,
          action_type: OtpType.FORGOT_PASSWORD
        },
        returning: true
      })

    return res.ok(true);
  }
  catch (err) {
    logger.error("set new password fail: ", err);
    next(err);
  }
}; 