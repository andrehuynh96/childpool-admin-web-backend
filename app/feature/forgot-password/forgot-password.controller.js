const logger = require('app/lib/logger');
const User = require("app/model/wallet").users;
const UserStatus = require("app/model/wallet/value-object/user-status");
const config = require("app/config");
const mailer = require('app/lib/mailer');
const OTP = require("app/model/wallet").user_otps;
const OtpType = require("app/model/wallet/value-object/otp-type");
const uuidV4 = require('uuid/v4');

module.exports = async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email,
        deleted_flg: false
      }
    });
    if (!user) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ["email"] });
    }

    if (user.user_sts == UserStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT", "UNCONFIRMED_ACCOUNT"));
    }

    if (user.user_sts == UserStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED", "ACCOUNT_LOCKED"));
    }

    let verifyToken = Buffer.from(uuidV4()).toString('base64');
    let today = new Date();
    today.setHours(today.getHours() + config.expiredVefiryToken);

    await OTP.update({
      expired: true
    }, {
        where: {
          user_id: user.id,
          action_type: OtpType.FORGOT_PASSWORD
        },
        returning: true
      })

    await OTP.create({
      code: verifyToken,
      used: false,
      expired: false,
      expired_at: today,
      user_id: user.id,
      action_type: OtpType.FORGOT_PASSWORD
    })

    _sendEmail(user, verifyToken);
    return res.ok(true);
  }
  catch (err) {
    logger.error("forgot password fail: ", err);
    next(err);
  }
};

async function _sendEmail(user, verifyToken) {
  try {
    let subject = 'Listco Account - Reset Account Password';
    let from = `Listco <${config.mailSendAs}>`;
    let data = {
      email: user.email,
      fullname: user.email,
      link: `${config.website.urlSetNewPassword}/${verifyToken}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, user.email, data, "forgot-password.ejs");
  } catch (err) {
    logger.error("send email forgot password fail", err);
  }
}