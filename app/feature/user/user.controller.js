const logger = require('app/lib/logger');
const User = require("app/model/wallet").users;
const UserStatus = require("app/model/wallet/value-object/user-status");
const userMapper = require("app/feature/response-schema/user.response-schema");
const bcrypt = require('bcrypt');
const config = require("app/config");
const uuidV4 = require('uuid/v4');
const OTP = require("app/model/wallet").user_otps;
const OtpType = require("app/model/wallet/value-object/otp-type");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const mailer = require('app/lib/mailer');
const database = require('app/lib/database').db().wallet;
const Role = require("app/model/wallet").roles;
const UserRole = require("app/model/wallet").user_roles;
module.exports = {
  search: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let where = { deleted_flg: false };
      if (req.query.user_sts) {
        where.user_sts = req.query.user_sts
      }
      if (req.query.query) {
        where.email = { [Op.iLike]: `%${req.query.query}%` };
      }
      const { count: total, rows: items } = await User.findAndCountAll({ limit, offset, where: where, order: [['created_at', 'DESC']] });
      return res.ok({
        items: userMapper(items),
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('search user fail:', err);
      next(err);
    }
  },
  get: async (req, res, next) => {
    try {
      let result = await User.findOne({
        where: {
          id: req.params.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ['id'] });
      }

      let userRole = await UserRole.findOne({
        where: {
          user_id: req.params.id
        }
      })

      let response = userMapper(result);
      if (userRole) {
        response.role_id = userRole.role_id;
      }
      return res.ok(response);
    }
    catch (err) {
      logger.error('getMe fail:', err);
      next(err);
    }
  },
  delete: async (req, res, next) => {
    let transaction;
    try {
      if (req.params.id == req.user.id) {
        return res.badRequest(res.__("USER_NOT_DELETED"), "USER_NOT_DELETED", { fields: ['id'] });
      }
      let result = await User.findOne({
        where: {
          id: req.params.id
        }
      })
      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ['id'] });
      }

      transaction = await database.transaction();
      await UserRole.destroy({
        where: {
          user_id: req.params.id
        }
      }, { transaction });
      let response = await User.destroy({
        where: {
          id: req.params.id
        },
        returning: true
      }, { transaction });
      await transaction.commit();

      if (!response || response.length == 0) {
        return res.serverInternalError();
      }
      _sendEmailDeleteUser(result);
      return res.ok(true);
    }
    catch (err) {
      logger.error('delete user fail:', err);
      if (transaction) await transaction.rollback();
      next(err);
    }
  },
  create: async (req, res, next) => {
    let transaction;
    try {
      let result = await User.findOne({
        where: {
          email: req.body.email,
          deleted_flg: false
        }
      })

      if (result) {
        return res.badRequest(res.__("EMAIL_EXISTS_ALREADY"), "EMAIL_EXISTS_ALREADY", { fields: ['email'] });
      }

      let role = await Role.findOne({
        where: {
          id: req.body.role_id
        }
      })

      if (!role) {
        return res.badRequest(res.__("ROLE_NOT_FOUND"), "ROLE_NOT_FOUND", { fields: ['role_id'] });
      }
      transaction = await database.transaction();

      let passWord = bcrypt.hashSync("Abc@123456", 10);
      let user = await User.create({
        email: req.body.email,
        name: req.body.name,
        password_hash: passWord,
        user_sts: UserStatus.UNACTIVATED,
        updated_by: req.user.id,
        created_by: req.user.id
      }, { transaction });
      
      if (!user) {
        if (transaction) await transaction.rollback();
        return res.serverInternalError();
      }

      await UserRole.destroy({
        where: {
          user_id: user.id,
        }
      }, { transaction });

      let userRole = await UserRole.create({
        user_id: user.id,
        role_id: role.id
      }, { transaction });

      if (!userRole) {
        if (transaction) await transaction.rollback();
        return res.serverInternalError();
      }

      let verifyToken = Buffer.from(uuidV4()).toString('base64');
      let today = new Date();
      today.setHours(today.getHours() + config.expiredVefiryToken);
      await OTP.update({
        expired: true
      }, {
        where: {
          user_id: user.id,
          action_type: OtpType.CREATE_ACCOUNT
        },
        returning: true
      })

      await OTP.create({
        code: verifyToken,
        used: false,
        expired: false,
        expired_at: today,
        user_id: user.id,
        action_type: OtpType.CREATE_ACCOUNT
      })
      await transaction.commit();
      _sendEmailCreateUser(user, verifyToken);

      let response = userMapper(user);
      response.role_id = role.id
      return res.ok(response);
    }
    catch (err) {
      logger.error('create account fail:', err);
      if (transaction) await transaction.rollback();
      next(err);
    }
  },
  update: async (req, res, next) => {
    let transaction;
    try {
      let result = await User.findOne({
        where: {
          id: req.params.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ['id'] });
      }

      let role = await Role.findOne({
        where: {
          id: req.body.role_id
        }
      })

      if (!role) {
        return res.badRequest(res.__("ROLE_NOT_FOUND"), "ROLE_NOT_FOUND", { fields: ['role_id'] });
      }

      transaction = await database.transaction();

      let [_, response] = await User.update({
        user_sts: req.body.user_sts,
        email: req.body.email,
        name: req.body.name
      }, {
        where: {
          id: req.params.id
        },
        returning: true
      }, { transaction });
      if (!response || response.length == 0) {
        if (transaction) await transaction.rollback();
        return res.serverInternalError();
      }

      await UserRole.destroy({
        where: {
          user_id: result.id,
        }
      }, { transaction });

      let userRole = await UserRole.create({
        user_id: result.id,
        role_id: role.id
      }, { transaction });

      if (!userRole) {
        if (transaction) await transaction.rollback();
        return res.serverInternalError();
      }

      await transaction.commit();

      result = await User.findOne({
        where: {
          id: req.params.id
        }
      })

      let user = userMapper(result);
      user.role_id = role.id
      return res.ok(user);
    }
    catch (err) {
      logger.error('update user fail:', err);
      if (transaction) await transaction.rollback();
      next(err);
    }
  },

  active: async (req, res, next) => {
    try {
      let otp = await OTP.findOne({
        where: {
          code: req.body.verify_token,
          action_type: { [Op.in]: [OtpType.CREATE_ACCOUNT] }
        }
      });
      if (!otp) {
        return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID", { fields: ["verify_token"] });
      }

      let today = new Date();
      if (otp.expired_at < today || otp.expired || otp.used) {
        return res.badRequest(res.__("TOKEN_EXPIRED"), "TOKEN_EXPIRED", { fields: ['verify_token'] });
      }

      let user = await User.findOne({
        where: {
          id: otp.user_id
        }
      });
      if (!user) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }

      if (user.user_sts == UserStatus.LOCKED) {
        return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
      }

      let passWord = bcrypt.hashSync(req.body.password, 10);
      let [_, response] = await User.update({
        password_hash: passWord,
        user_sts: UserStatus.ACTIVATED
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
          action_type: OtpType.CREATE_ACCOUNT
        },
        returning: true
      })

      return res.ok(true);
    }
    catch (err) {
      logger.error("set new password fail: ", err);
      next(err);
    }
  },
  resendEmailActive: async (req, res, next) => {
    try {
      let userId = req.params.id;
      let user = await User.findOne({
        where: {
          id: userId
        }
      })

      if (!user) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ['id'] });
      }

      if (user.user_sts == UserStatus.ACTIVATED) {
        return res.forbidden(res.__("ACCOUNT_ACTIVATED_ALREADY"), "ACCOUNT_ACTIVATED_ALREADY");
      }

      if (user.user_sts == UserStatus.LOCKED) {
        return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
      }


      let verifyToken = Buffer.from(uuidV4()).toString('base64');
      let today = new Date();
      today.setHours(today.getHours() + config.expiredVefiryToken);
      await OTP.update({
        expired: true
      }, {
        where: {
          user_id: user.id,
          action_type: OtpType.CREATE_ACCOUNT
        },
        returning: true
      })

      await OTP.create({
        code: verifyToken,
        used: false,
        expired: false,
        expired_at: today,
        user_id: user.id,
        action_type: OtpType.CREATE_ACCOUNT
      })
      _sendEmailCreateUser(user, verifyToken);
      return res.ok(true);
    }
    catch (err) {
      logger.error('create account fail:', err);
      next(err);
    }
  }
}

async function _sendEmailCreateUser(user, verifyToken) {
  try {
    let subject = 'Listco Account - Create Account';
    let from = `Listco <${config.mailSendAs}>`;
    let data = {
      email: user.email,
      fullname: user.email,
      site: config.website.url,
      link: `${config.website.urlActiveUser}/${verifyToken}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, user.email, data, "create-user.ejs");
  } catch (err) {
    logger.error("send email create account fail", err);
  }
}

async function _sendEmailDeleteUser(user) {
  try {
    let subject = 'Listco Account - Delete Account';
    let from = `Listco <${config.mailSendAs}>`;
    let data = {
      email: user.email,
      fullname: user.email,
      site: config.website.url
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, user.email, data, "delete-user.ejs");
  } catch (err) {
    logger.error("send email create account fail", err);
  }
}