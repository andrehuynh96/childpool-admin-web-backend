const logger = require("app/lib/logger");
const Setting = require("app/model/wallet").settings;

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
      for (e of results) {
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
  }
}