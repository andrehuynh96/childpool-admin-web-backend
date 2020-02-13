const logger = require('app/lib/logger');
const User = require("app/model/wallet").users;
const UserIps = require("app/model/wallet").user_ips;
const UserActivityLog = require("app/model/wallet").user_activity_logs;
const userOTP = require("app/model/wallet").user_otps;
const mailer = require('app/lib/mailer');
const UserStatus = require("app/model/wallet/value-object/user-status");
const ActionType = require("app/model/wallet/value-object/user-activity-action-type");
const OtpType = require("app/model/wallet/value-object/otp-type");
const userMapper = require("app/feature/response-schema/user.response-schema");
const bcrypt = require('bcrypt');
const config = require("app/config");
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
        const match = await bcrypt.compare(req.body.password, user.password_hash);
        if (!match) {
          return res.unauthorized(res.__("LOGIN_FAIL", "LOGIN_FAIL"));
        }
        if (user.user_sts == UserStatus.UNACTIVATED) {
          return res.forbidden(res.__("UNCONFIRMED_ACCOUNT", "UNCONFIRMED_ACCOUNT"));
        }
    
        if (user.user_sts == UserStatus.LOCKED) {
          return res.forbidden(res.__("ACCOUNT_LOCKED", "ACCOUNT_LOCKED"));
        }
    
        if (user.twofa_enable_flg) {
          let verifyToken = Buffer.from(uuidV4()).toString('base64');
          let today = new Date();
          today.setHours(today.getHours() + config.expiredVefiryToken);
    
          await userOTP.update({
            expired: true
          }, {
              where: {
                user_id: user.id,
                action_type: OtpType.TWOFA
              },
              returning: true
            })
    
          await userOTP.create({
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
          const registerIp = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip).replace(/^.*:/, '');
          let userIp = await UserIps.findOne({ 
            where:{
                user_id: user.id,
                client_ip: registerIp,
                allow_flg: true,
            }
          })
          await UserActivityLog.create({
            user_id: user.id,
            client_ip: registerIp,
            action: ActionType.LOGIN,
            user_agent: req.headers['user-agent']
          });
          if(!userIp){ //TODO
            let verifyToken = Buffer.from(uuidV4()).toString('base64');
            let today = new Date();
            today.setHours(today.getHours() + config.expiredVefiryToken);
            await userOTP.update({
                expired: true
              }, {
                  where: {
                    user_id: user.id,
                    action_type: OtpType.TWOFA
                  },
                  returning: true
                })
        
              await userOTP.create({
                code: verifyToken,
                used: false,
                expired: false,
                expired_at: today,
                user_id: user.id,
                action_type: OtpType.TWOFA
              })
            _sendEmail(user, verifyToken);
            return res.ok(true);
          }
          else {
            req.session.authenticated = true;
            req.session.user = user;
            return res.ok({
                twofa: false,
                user: userMapper(user)
            });
          }
        }
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