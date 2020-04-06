const logger = require('app/lib/logger');
const User = require("app/model/wallet").users;
const UserRole = require('app/model/wallet').user_roles;
const UserOTP = require("app/model/wallet").user_otps;
const UserIps = require("app/model/wallet").user_ips;
const RolePermissions = require("app/model/wallet").role_permissions;
const Permissions = require("app/model/wallet").permissions;
const UserStatus = require("app/model/wallet/value-object/user-status");
const OtpType = require("app/model/wallet/value-object/otp-type");
const userMapper = require("app/feature/response-schema/user.response-schema");
const speakeasy = require("speakeasy");
const UserActivityLog = require("app/model/wallet").user_activity_logs;
const ActionType = require("app/model/wallet/value-object/user-activity-action-type");
const uuidV4 = require('uuid/v4');
const config = require("app/config");
const mailer = require('app/lib/mailer');
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
    let user = await User.findOne({
      where: {
        id: user_otp.user_id
      }
    });
    if (!user) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
    }

    if (user.status == UserStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
    }

    if (user.status == UserStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
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
    let roles = await UserRole.findAll({
      attributes: ['role_id'],
      where: {
        user_id: user.id
      }
    })
    let userIp = await UserIps.findOne({
      where: {
        user_id: user.id,
        client_ip: registerIp,
        allow_flg: true,
      }
    })
    if (!userIp) {
      let verifyToken = Buffer.from(uuidV4()).toString('base64');
      let today = new Date();
      today.setHours(today.getHours() + config.expiredConfirmIpToken);
      await UserOTP.update({
        expired: true
      }, {
        where: {
          user_id: user.id,
          action_type: OtpType.CONFIRM_IP
        },
        returning: true
      })

      await UserOTP.create({
        code: verifyToken,
        used: false,
        expired: false,
        expired_at: today,
        user_id: user.id,
        action_type: OtpType.CONFIRM_IP
      })
      await UserIps.create({
        user_id: user.id,
        client_ip: registerIp,
        allow_flg: false,
        verify_token: verifyToken
      })
      _sendEmail(user, verifyToken);
      return res.ok({
        confirm_ip: true,
        verify_token: verifyToken
      });
    }
    await UserActivityLog.create({
      user_id: user.id,
      client_ip: registerIp,
      action: ActionType.LOGIN,
      user_agent: req.headers['user-agent']
    });

    req.session.authenticated = true;
    req.session.user = user;

    let roleList = roles.map(role => role.role_id);
    let rolePermissions = await RolePermissions.findAll({
      attributes: [
        "permission_id"
      ],
      where: {
        role_id: roleList
      }
    });
    rolePermissions = [...new Set(rolePermissions.map(ele => ele.permission_id))];
    let permissions = await Permissions.findAll({
      attributes: [
        "name"
      ],
      where: {
        id: rolePermissions
      }
    });
    req.session.roles = permissions.map(ele => ele.name);
    console.log(req.session.roles)
    return res.ok(userMapper(user));
  }
  catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
};
async function _sendEmail(user, verifyToken) {
  try {
    let subject = 'Listco Account - New IP Confirmation';
    let from = `Listco <${config.mailSendAs}>`;
    let data = {
      email: user.email,
      fullname: user.email,
      link: `${config.website.urlConfirmIp}/${verifyToken}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, user.email, data, "confirm-ip.ejs");
  } catch (err) {
    logger.error("send email confirm new IP fail", err);
  }
}