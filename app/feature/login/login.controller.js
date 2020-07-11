const Sequelize = require('sequelize');
const logger = require('app/lib/logger');
const User = require("app/model/wallet").users;
const UserIps = require("app/model/wallet").user_ips;
const UserActivityLog = require("app/model/wallet").user_activity_logs;
const UserOTP = require("app/model/wallet").user_otps;
const RolePermissions = require("app/model/wallet").role_permissions;
const Permissions = require("app/model/wallet").permissions;
const mailer = require('app/lib/mailer');
const UserStatus = require("app/model/wallet/value-object/user-status");
const ActionType = require("app/model/wallet/value-object/user-activity-action-type");
const OtpType = require("app/model/wallet/value-object/otp-type");
const userMapper = require("app/feature/response-schema/user.response-schema");
const bcrypt = require('bcrypt');
const config = require("app/config");
const uuidV4 = require('uuid/v4');
const UserRole = require('app/model/wallet').user_roles;
const Roles = require('app/model/wallet').roles;
const StakingAPI = require("app/lib/staking-api/partner-api-key")
module.exports = {
  login: async (req, res, next) => {
    try {
      let user = await User.findOne({
        where: {
          email: req.body.email.toLowerCase(),
          deleted_flg: false
        }
      });
      if (!user) {
        return res.badRequest(res.__("LOGIN_FAIL"), "LOGIN_FAIL");
      }
      if (user.user_sts == UserStatus.UNACTIVATED) {
        return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
      }

      if (user.user_sts == UserStatus.LOCKED) {
        return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
      }

      const match = await bcrypt.compare(req.body.password, user.password_hash);
      if (!match) {
        if (user.attempt_login_number + 1 <= config.lockUser.maximumTriesLogin) {
          await User.update({
            attempt_login_number: user.attempt_login_number + 1, // increase attempt_login_number in case wrong password
            latest_login_at: Sequelize.fn('NOW') // TODO: review this in case 2fa is enabled
          }, {
            where: {
              id: user.id
            }
          })
          if (user.attempt_login_number + 1 == config.lockUser.maximumTriesLogin)
            return res.forbidden(res.__("ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS"), "ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS");
          else return res.unauthorized(res.__("LOGIN_FAIL"), "LOGIN_FAIL");
        }
        else {
          let nextAcceptableLogin = new Date(user.latest_login_at ? user.latest_login_at : null);
          nextAcceptableLogin.setMinutes(nextAcceptableLogin.getMinutes() + parseInt(config.lockUser.lockTime));
          let rightNow = new Date();
          if (nextAcceptableLogin < rightNow) { // don't forbid if lock time has passed
            await User.update({
              attempt_login_number: 1,
              latest_login_at: Sequelize.fn('NOW') // TODO: review this in case 2fa is enabled
            }, {
              where: {
                id: user.id
              }
            });
            return res.unauthorized(res.__("LOGIN_FAIL"), "LOGIN_FAIL");
          }
          else return res.forbidden(res.__("ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS"), "ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS");
        }
      }
      else {
        let nextAcceptableLogin = new Date(user.latest_login_at ? user.latest_login_at : null);
        nextAcceptableLogin.setMinutes(nextAcceptableLogin.getMinutes() + parseInt(config.lockUser.lockTime));
        let rightNow = new Date();
        if (nextAcceptableLogin >= rightNow && user.attempt_login_number >= config.lockUser.maximumTriesLogin) // don't forbid if lock time has passed
          return res.forbidden(res.__("ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS"), "ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS");
        await User.update({
          attempt_login_number: 0,
          latest_login_at: Sequelize.fn('NOW') // TODO: review this in case 2fa is enabled
        }, {
          where: {
            id: user.id
          }
        })
      }

      if (user.twofa_enable_flg) {
        let verifyToken = Buffer.from(uuidV4()).toString('base64');
        let today = new Date();
        today.setHours(today.getHours() + config.expiredVefiryToken);

        await UserOTP.update({
          expired: true
        }, {
          where: {
            user_id: user.id,
            action_type: OtpType.TWOFA
          },
          returning: true
        })

        await UserOTP.create({
          code: verifyToken,
          used: false,
          expired: false,
          expired_at: today,
          user_id: user.id,
          action_type: OtpType.TWOFA
        })

        return res.ok({
          twofa: true,
          verify_token: verifyToken
        });
      }
      else {
        const registerIpString = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip);
        let regiterIps = registerIpString.split(',')
        const registerIp = regiterIps.length > 0 ? regiterIps[0].trim() : ''
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
        let loginHistory = await UserActivityLog.create({
          user_id: user.id,
          client_ip: registerIp,
          action: ActionType.LOGIN,
          user_agent: req.headers['user-agent']
        });
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
          let roleName = await Roles.findOne({
            where: {
              id: roles[0].role_id
            }
          })
          user.role = roleName.name
          _sendEmail(user, verifyToken, loginHistory);
          return res.ok({
            confirm_ip: true,
            twofa: false,
          });
        }
        else {
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
          req.session.permissions = permissions.map(ele => ele.name);
          roleList = await Roles.findAll({
            attributes: [
              "id", "name", "level", "root_flg"
            ],
            where: {
              id: roleList
            }
          })
          let response = userMapper(user);
          response.roles = roleList;
          req.session.roles = roleList;

          let partner = await StakingAPI.getPartner();
          return res.ok({
            confirm_ip: false,
            twofa: false,
            user: response,
            partner: partner ? partner.data : {}
          });
        }
      }
    }
    catch (err) {
      logger.error("login fail: ", err);
      next(err);
    }
  }
}
async function _sendEmail(user, verifyToken, loginHistory) {
  try {
    let subject = `${config.emailTemplate.partnerName} - New IP Confirmation`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      role: user.role,
      link: `${config.website.urlConfirmNewIp}${verifyToken}`,
      accessType: loginHistory.user_agent,
      time: loginHistory.createdAt,
      ipAddress: loginHistory.client_ip
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, user.email, data, config.emailTemplate.confirmNewIp);
  } catch (err) {
    logger.error("send email confirm new IP fail", err);
  }
}