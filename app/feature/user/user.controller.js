const _ = require('lodash');
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
const Country = require("app/model/wallet").countries;
const countryMapper = require("app/feature/response-schema/country.response-schema");

module.exports = {
  search: async (req, res, next) => {
    try {
      let { query } = req;
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let rolesControl = await _getRoleControl(req.roles);
      let where = { deleted_flg: false };
      if (query.name) {
        where.name = { [Op.iLike]: `%${query.name}%` };
      }
      if (query.email) {
        where.email = { [Op.iLike]: `%${query.email}%` };
      }
      let include = [
        {
          model: UserRole,
          include: [
            {
              model: Role
            }
          ],
          where: {
            role_id: { [Op.in]: rolesControl }
          }
        }
      ];
      if (req.query.user_sts) {
        where.user_sts = req.query.user_sts;
      }
      if (req.query.query) {
        where.email = { [Op.iLike]: `%${req.query.query}%` };
      }
      const { count: total, rows: items } = await User.findAndCountAll({ limit, offset, where: where, include: include, order: [['created_at', 'DESC']] });

      if (items.length > 0) {
        const countries = await Country.findAll({});
        const cache = _.keyBy(countries, 'code');

        items.forEach(item => item.country = cache[item.country_code]);
      }

      return res.ok({
        items: items.length > 0 ? userMapper(items) : [],
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
      });

      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ['id'] });
      }

      let userRole = await UserRole.findOne({
        where: {
          user_id: req.params.id
        }
      });

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
      });
      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ['id'] });
      }

      transaction = await database.transaction();
      await UserRole.destroy({
        where: {
          user_id: req.params.id
        },
        transaction: transaction
      });
      let response = await User.destroy({
        where: {
          id: req.params.id
        },
        returning: true,
        transaction: transaction
      });
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
          email: req.body.email.toLowerCase(),
          deleted_flg: false
        }
      });
      if (result) {
        return res.badRequest(res.__("EMAIL_EXISTS_ALREADY"), "EMAIL_EXISTS_ALREADY", { fields: ['email'] });
      }

      let role = await Role.findOne({
        where: {
          id: req.body.role_id
        }
      });
      if (!role) {
        return res.badRequest(res.__("ROLE_NOT_FOUND"), "ROLE_NOT_FOUND", { fields: ['role_id'] });
      }

      let country_code = req.body.country_code;
      if (country_code) {
        let country = await Country.findOne({
          where: {
            code: country_code
          }
        });
        if (!country) {
          return res.badRequest(res.__("COUNTRY_CODE_NOT_FOUND"), "COUNTRY_CODE_NOT_FOUND", { fields: ['country_code'] });
        }
      }

      transaction = await database.transaction();
      let passWord = bcrypt.hashSync(uuidV4(), 10);
      let user = await User.create({
        email: req.body.email.toLowerCase(),
        name: req.body.name,
        password_hash: passWord,
        user_sts: UserStatus.UNACTIVATED,
        country_code,
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
        },
        transaction: transaction
      });

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
      });

      await OTP.create({
        code: verifyToken,
        used: false,
        expired: false,
        expired_at: today,
        user_id: user.id,
        action_type: OtpType.CREATE_ACCOUNT
      });
      user.role = role.name,
        user.adminName = req.user.name;
      await transaction.commit();
      _sendEmailCreateUser(user, verifyToken);

      let response = userMapper(user);
      response.role_id = role.id;
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
      });
      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ['id'] });
      }

      let role = await Role.findOne({
        where: {
          id: req.body.role_id
        }
      });
      if (!role) {
        return res.badRequest(res.__("ROLE_NOT_FOUND"), "ROLE_NOT_FOUND", { fields: ['role_id'] });
      }

      let country_code = req.body.country_code;
      if (country_code) {
        let country = await Country.findOne({
          where: {
            code: country_code
          }
        });
        if (!country) {
          return res.badRequest(res.__("COUNTRY_CODE_NOT_FOUND"), "COUNTRY_CODE_NOT_FOUND", { fields: ['country_code'] });
        }
      }

      transaction = await database.transaction();

      let [_, response] = await User.update({
        user_sts: req.body.user_sts,
        name: req.body.name,
        country_code,
      }, {
        where: {
          id: req.params.id
        },
        returning: true,
        transaction: transaction
      });
      if (!response || response.length == 0) {
        if (transaction) await transaction.rollback();
        return res.serverInternalError();
      }

      await UserRole.destroy({
        where: {
          user_id: result.id,
        },
        transaction: transaction
      });

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
      });

      let user = userMapper(result);
      user.role_id = role.id;
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
      });

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
      });

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
      });

      await OTP.create({
        code: verifyToken,
        used: false,
        expired: false,
        expired_at: today,
        user_id: user.id,
        action_type: OtpType.CREATE_ACCOUNT
      });
      let userRole = await UserRole.findOne({
        where: {
          user_id: user.id
        }
      });

      let role = await Role.findOne({
        where: {
          id: userRole.role_id
        }
      });
      user.role = role.name;
      user.adminName = req.user.name;
      _sendEmailCreateUser(user, verifyToken);
      return res.ok(true);
    }
    catch (err) {
      logger.error('create account fail:', err);
      next(err);
    }
  },
  getCountries: async (req, res, next) => {
    try {
      const countries = await Country.findAll({
        where: {
          actived_flg: true,
        },
        order: [['order_index', 'ASC']],
      });

      return res.ok(countryMapper(countries));
    }
    catch (err) {
      logger.error('get countries fail:', err);
      next(err);
    }
  },
};

async function _sendEmailCreateUser(user, verifyToken) {
  try {
    let subject = `${config.emailTemplate.partnerName} - Create Account`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      name: user.adminName,
      role: user.role,
      link: `${config.website.urlActiveUser}${verifyToken}`,
      hours: config.expiredVefiryToken
    };
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, user.email, data, config.emailTemplate.activeAccount);
  } catch (err) {
    logger.error("send email create account fail", err);
  }
}

async function _sendEmailDeleteUser(user) {
  try {
    let subject = `${config.emailTemplate.partnerName} - Delete Account`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
    };
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, user.email, data, config.emailTemplate.deactiveAccount);
  } catch (err) {
    logger.error("send email delete account fail", err);
  }
}

async function _getRoleControl(roles) {
  let levels = roles.map(ele => ele.level);
  let roleControl = [];

  for (let e of levels) {
    const roles = await Role.findAll({
      where: {
        level: { [Op.gt]: e },
        deleted_flg: false,
        root_flg: false,
      },
      order: [['level', 'ASC']]
    });

    if (roles.length > 0) {
      roleControl = roleControl.concat(roles.map(x => x.id));
    }
  }

  return roleControl;
}
