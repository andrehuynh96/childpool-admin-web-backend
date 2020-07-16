const logger = require("app/lib/logger");
const database = require('app/lib/database').db().wallet;
const Setting = require("app/model/wallet").settings;
const MembershipType = require("app/model/wallet").membership_types;
const { affiliateApi } = require('app/lib/affiliate-api');
module.exports = {
  get: async (req, res, next) => {
    try {
      let results = await Setting.findAll();
      if (!results || results.length == 0) {
        return res.ok({});
      }
      let data = {
        membership_type_free_membership_flg: true,
        membership_type_upgrade_paid_member_flg: true
      };
      for (let e of results) {
        if (e.key == 'MEMBERSHIP_TYPE_FREE_MEMBERSHIP_FLG') {
          data.membership_type_free_membership_flg = JSON.parse(e.value);
        } else if (e.key == 'MEMBERSHIP_TYPE_UPGRADE_PAID_MEMBER_FLG') {
          data.membership_type_upgrade_paid_member_flg = JSON.parse(e.value);
        }
      }
      return res.ok(data);
    }
    catch (err) {
      logger.error("get membership type config fail", err);
      next(err);
    }
  },
  update: async (req, res, next) => {
    let transaction;
    try {
      transaction = await database.transaction();
      for (let key of Object.keys(req.body)) {
        if (key == 'items') {
          for (let item of req.body.items) {
            const data = {
              is_enabled: item.is_enabled,
              name: item.name,
              price: item.price,
            };

            await MembershipType.update(data, {
              where: {
                id: item.id
              },
              returning: true,
              transaction: transaction
            });
          }
          const membershipTypeIds = req.body.items.map(item => item.id);
          const membershipTypes = await MembershipType.findAll({
            where: {
              id: membershipTypeIds
            }
          });
          const result = await affiliateApi.updateMembershipTypeConfig(membershipTypes);
          if (result.httpCode !== 200) {
            return res.status(result.httpCode).send(result.data);
          }
        } else {
          await Setting.update({
            value: req.body[key],
            updated_by: req.user.id
          }, {
            where: {
              property: key
            },
            returning: true,
            transaction: transaction
          });
        }
      }
      await transaction.commit();
      return res.ok(true);

    }
    catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error("update membership type config fail", err);
      next(err);
    }
  }
};