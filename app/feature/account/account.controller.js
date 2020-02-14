const logger = require('app/lib/logger');
const User = require("app/model/wallet").users;
const bcrypt = require('bcrypt');
const speakeasy = require("speakeasy");
const userMapper = require("app/feature/response-schema/user.response-schema");
const UserActivityLog = require("app/model/wallet").user_activity_logs;
const ActionType = require("app/model/wallet/value-object/user-activity-action-type");

module.exports = {
  getMe: async (req, res, next) => {
    try {
      let result = await User.findOne({
        where: {
          id: req.user.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }

      return res.ok(userMapper(result));
    }
    catch (err) {
      logger.error('getMe fail:', err);
      next(err);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      let result = await User.findOne({
        where: {
          id: req.user.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }

      const match = await bcrypt.compare(req.body.password, result.password_hash);
      if (!match) {
        return res.badRequest(res.__("PASSWORD_INVALID", "PASSWORD_INVALID"));
      }

      let passWord = bcrypt.hashSync(req.body.new_password, 10);
      let [_, user] = await User.update({
        password_hash: passWord
      }, {
        where: {
          id: req.user.id,
        },
        returning: true
      });

      if (!user || user.length == 0) {
        return res.serverInternalError();
      }

      return res.ok(true);
    }
    catch (err) {
      logger.error('changePassword fail:', err);
      next(err);
    }
  },
};