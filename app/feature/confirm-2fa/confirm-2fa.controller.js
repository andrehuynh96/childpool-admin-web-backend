const logger = require('app/lib/logger');
const User = require("app/model/wallet").users;
const UserOTP = require("app/model/wallet").user_otps;
const UserStatus = require("app/model/wallet/value-object/user-status");
const OtpType = require("app/model/wallet/value-object/otp-type");
const userMapper = require("app/feature/response-schema/user.response-schema");
const speakeasy = require("speakeasy");
const UserActivityLog = require("app/model/wallet").user_activity_logs;
const ActionType = require("app/model/wallet/value-object/user-activity-action-type");

module.exports = async (req, res, next) => {
    try {
        let user_otp = await UserOTP.findOne({
            where: {
              code: req.body.verify_token,
              action_type: OtpType.TWOFA
            }
        });
        console.log(user_otp)
        if (!user_otp) {
            return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID", { fields: ["verify_token"] });
        }
        let today = new Date();
        if (user_otp.expired_at < today || user_otp.expired || user_otp.used) {
        return res.badRequest(res.__("TOKEN_EXPIRED"), "TOKEN_EXPIRED");
        }
        let user = await User.findOne({
            where: {
              id: user_otp.user_id
            }
        });
        if (!user) {
            return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
        }
      
        if (user.status == UserStatus.UNACTIVATED) {
            return res.forbidden(res.__("UNCONFIRMED_ACCOUNT", "UNCONFIRMED_ACCOUNT"));
        }
      
        if (user.status == UserStatus.LOCKED) {
            return res.forbidden(res.__("ACCOUNT_LOCKED", "ACCOUNT_LOCKED"));
        }
        var verified = speakeasy.totp.verify({
            secret: user.twofa_secret,
            encoding: 'base32',
            token: req.body.twofa_code,
        });
        if (!verified) {
            return res.badRequest(res.__("TWOFA_CODE_INCORRECT"), "TWOFA_CODE_INCORRECT", { fields: ["twofa_code"] });
        }
        await UserOTP.update({
            used: true
          }, {
              where: {
                id: user_otp.id
            },
        });
        const registerIp = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip).replace(/^.*:/, '');
        await UserActivityLog.create({
            user_id: user.id,
            client_ip: registerIp,
            action: ActionType.LOGIN,
            user_agent: req.headers['user-agent']
        });
      
        req.session.authenticated = true;
        req.session.user = user;
        return res.ok(userMapper(user));
    }
    catch(err){
        logger.error("login fail: ", err);
        next(err);
    }
};