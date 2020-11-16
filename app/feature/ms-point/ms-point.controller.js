const Sequelize = require('sequelize');
const moment = require('moment');
const { forEach } = require('p-iteration');
const logger = require('app/lib/logger');
const PointHistory = require("app/model/wallet").point_histories;
const Member = require("app/model/wallet").members;
const Setting = require('app/model/wallet').settings;
const MembershipType = require('app/model/wallet').membership_types;
const SystemType = require("app/model/wallet/value-object/system-type");
const PointStatus = require("app/model/wallet/value-object/point-status");
const PointAction = require("app/model/wallet/value-object/point-action");
const mapper = require("app/feature/response-schema/claim-point.response-schema");
const membershipTypeMapper = require("app/feature/response-schema/membership-type.response-schema");
const MsPointPhaseType = require("app/model/wallet/value-object/ms-point-phase-type");

const database = require('app/lib/database').db().wallet;

const Op = Sequelize.Op;

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = parseInt(query.limit);
      const offset = parseInt(query.offset);
      const where = {
        system_type: SystemType.MEMBERSHIP,
      };
      let fromDate, toDate;

      if (query.from_date || query.to_date) {
        where.created_at = {};
      }

      if (query.from_date) {
        fromDate = moment(query.from_date).toDate();
        where.created_at[Op.gte] = fromDate;
      }
      if (query.to_date) {
        toDate = moment(query.to_date).toDate();
        where.created_at[Op.lt] = toDate;
      }
      if (fromDate && toDate && fromDate >= toDate) {
        return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['from_date', 'to_date'] });
      }
      if (query.status) {
        where.status = query.status;
      }
      if (query.action) {
        where.action = query.action;
      }

      const memberCond = {
        deleted_flg: false
      };

      if (query.email) {
        memberCond.email = { [Op.iLike]: `%${query.email}%` };
      }

      const { count: total, rows: items } = await PointHistory.findAndCountAll({
        limit,
        offset,
        include: [
          {
            attributes: ['id', 'email'],
            as: "Member",
            model: Member,
            where: memberCond,
            required: true
          }
        ],
        where: where,
        order: [['created_at', 'DESC']]
      });

      return res.ok({
        items: mapper(items) && items.length > 0 ? mapper(items) : [],
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (error) {
      logger.error('get claim point list fail', error);
      next(error);
    }
  },
  getStatuses: async (req, res, next) => {
    try {
      const statuses = Object.entries(PointStatus);
      const dropdownList = statuses.map(item => {
        return {
          label: item[0],
          value: item[1]
        };
      });
      return res.ok(dropdownList);
    } catch (error) {
      logger.error('get point status list fail', error);
      next(error);
    }
  },
  getActions: async (req, res, next) => {
    try {
      const statuses = Object.entries(PointAction);
      const dropdownList = statuses.map(item => {
        return {
          label: item[0],
          value: item[1]
        };
      });
      return res.ok(dropdownList);
    } catch (error) {
      logger.error('get point action list fail', error);
      next(error);
    }
  },
  getPhases: async (req, res, next) => {
    try {
      const result = Object.entries(MsPointPhaseType).map(items => {
        return {
          label: items[0],
          value: items[1]
        };
      });

      return res.ok(result);
    } catch (error) {
      logger.error('get phase list fail', error);
      next(error);
    }
  },
  getSettings: async (req, res, next) => {
    try {
      const keys = [
        'MS_POINT_DELAY_TIME_IN_SECONDS',
        'MS_POINT_MODE',
        'MS_POINT_STAKING_IS_ENABLED',
        'MS_POINT_UPGRADING_MEMBERSHIP_IS_ENABLED',
        'MS_POINT_EXCHANGE_IS_ENABLED',
        'MS_POINT_EXCHANGE_MININUM_VALUE_IN_USDT',
      ];
      const settings = await Setting.findAll({
        where: {
          key: {
            [Op.in]: keys,
          }
        }
      });
      const membershipTypes = await MembershipType.findAll({
        where: {
          is_enabled: true,
        },
        order: [['display_order', 'ASC'], ['name', 'ASC']],
      });

      const result = {
        ms_point_mode: getPropertyValue(settings, 'ms_point_mode', 'phase_1'),
        ms_point_delay_time_in_seconds: getPropertyValue(settings, 'ms_point_delay_time_in_seconds', '86400'),
        ms_point_staking_is_enabled: getPropertyValue(settings, 'ms_point_staking_is_enabled', 'true'),
        ms_point_upgrading_membership_is_enabled: getPropertyValue(settings, 'ms_point_upgrading_membership_is_enabled', 'true'),
        ms_point_exchange_is_enabled: getPropertyValue(settings, 'ms_point_exchange_is_enabled', 'true'),
        ms_point_exchange_mininum_value_in_usdt: getPropertyValue(settings, 'ms_point_exchange_mininum_value_in_usdt', null),
        membership_types: membershipTypeMapper(membershipTypes),
      };

      return res.ok(result);
    }
    catch (error) {
      logger.info('get ms point settings fail', error);
      next();
    }
  },
  updateModeSettings: async (req, res, next) => {
    let transaction;
    try {
      transaction = await database.transaction();
      const { ms_point_mode } = req.body;
      await Setting.update({
        value: ms_point_mode
      }, {
        where: {
          key: 'MS_POINT_MODE'
        },
        returning: true,
        transaction: transaction
      });
      await transaction.commit();

      return res.ok(true);
    }
    catch (error) {
      if (transaction) {
        transaction.rollback();
      }
      logger.info('update ms point settings fail', error);
      next();
    }
  },
  updateClaimingSettings: async (req, res, next) => {
    let transaction;
    try {
      transaction = await database.transaction();
      const { ms_point_delay_time_in_seconds, membership_types } = req.body;
      await Setting.update({
        value: ms_point_delay_time_in_seconds
      }, {
        where: {
          key: 'MS_POINT_DELAY_TIME_IN_SECONDS'
        },
        returning: true,
        transaction: transaction
      });

      await forEach(membership_types, async item => {
        await MembershipType.update({
          claim_points: item.points,
        }, {
          where: {
            id: item.id,
          },
          returning: true,
          transaction: transaction
        });
      });
      await transaction.commit();

      return res.ok(true);
    }
    catch (error) {
      if (transaction) {
        transaction.rollback();
      }
      logger.info('update ms point settings fail', error);
      next();
    }
  },
  updateStakingSettings: async (req, res, next) => {
    let transaction;
    try {
      transaction = await database.transaction();
      const { ms_point_staking_is_enabled, membership_types } = req.body;
      await Setting.update({
        value: ms_point_staking_is_enabled
      }, {
        where: {
          key: 'MS_POINT_STAKING_IS_ENABLED'
        },
        returning: true,
        transaction: transaction
      });

      await forEach(membership_types, async item => {
        await MembershipType.update({
          staking_points: item.points,
        }, {
          where: {
            id: item.id,
          },
          returning: true,
          transaction: transaction
        });
      });
      await transaction.commit();

      return res.ok(true);
    }
    catch (error) {
      if (transaction) {
        transaction.rollback();
      }
      logger.info('update ms point settings fail', error);
      next();
    }
  },
  updateExchangeSettings: async (req, res, next) => {
    let transaction;
    try {
      transaction = await database.transaction();
      const {
        ms_point_exchange_is_enabled,
        ms_point_exchange_mininum_value_in_usdt,
        membership_types,
      } = req.body;

      await Promise.all([
        Setting.update({
          value: ms_point_exchange_is_enabled
        }, {
          where: {
            key: 'MS_POINT_EXCHANGE_IS_ENABLED'
          },
          returning: true,
          transaction: transaction
        }),

        Setting.update({
          value: ms_point_exchange_mininum_value_in_usdt
        }, {
          where: {
            key: 'MS_POINT_EXCHANGE_MININUM_VALUE_IN_USDT'
          },
          returning: true,
          transaction: transaction
        }),

        forEach(membership_types, async item => {
          await MembershipType.update({
            exchange_points: item.points,
          }, {
            where: {
              id: item.id,
            },
            returning: true,
            transaction: transaction
          });
        })
      ]);

      await transaction.commit();

      return res.ok(true);
    }
    catch (error) {
      if (transaction) {
        transaction.rollback();
      }
      logger.info('update ms point settings fail', error);
      next();
    }
  },
  updateUpgradeMembershipSettings: async (req, res, next) => {
    let transaction;
    try {
      transaction = await database.transaction();
      const {
        ms_point_upgrading_membership_is_enabled,
        membership_types,
      } = req.body;

      await Promise.all([
        Setting.update({
          value: ms_point_upgrading_membership_is_enabled
        }, {
          where: {
            key: 'MS_POINT_UPGRADING_MEMBERSHIP_IS_ENABLED'
          },
          returning: true,
          transaction: transaction
        }),

        forEach(membership_types, async item => {
          await MembershipType.update({
            upgrade_membership_points: item.points,
          }, {
            where: {
              id: item.id,
            },
            returning: true,
            transaction: transaction
          });
        })
      ]);

      await transaction.commit();

      return res.ok(true);
    }
    catch (error) {
      if (transaction) {
        transaction.rollback();
      }
      logger.info('update ms point settings fail', error);
      next();
    }
  },

};

const getPropertyValue = (settings, propertyName, defaultValue) => {
  const setting = settings.find(item => item.property === propertyName);
  if (!setting) {
    return defaultValue;
  }

  try {
    const { value, type } = setting;
    switch (type) {
      case 'string':
        return value;

      case 'number':
        return Number(value);

      case 'boolean':
        return value === 'true';
    }

    return value;
  } catch (error) {
    logger.info(error);
    return defaultValue;
  }
};
