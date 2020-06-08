const logger = require('app/lib/logger');
const MembershipApi = require("app/lib/membership-api");

module.exports = {
  search: async (req, res, next) => {
    try {
      // let items = await MembershipApi.searchMember(req.query);
      // if (!items.code) {
      //   return res.ok(items.data);
      // }
      // else {
      //   return res.status(parseInt(items.code)).send(items.data);
      // }

      // region memo data
      let data = {
        items: [
          {
            id: '1',
            name: 'User1',
            membership_type: 'Free',
            kyc_level: 'KYC 1',
            kyc_status: 'Approved',
            referral_code: '0FA2MN',
            referrer: '',
            create_at: '2020-03-04 19:44:44.194+09'
          },
          {
            id: '2',
            name: 'User2',
            membership_type: 'Paid',
            kyc_level: 'KYC 1',
            kyc_status: 'Approved',
            referral_code: '1FE2MK',
            referrer: '0FA2MN',
            create_at: '2020-04-29 15:15:51.676+09'
          }
        ],
        total: 2,
        limit: 10,
        offset: 0,
      }
      //end region
      return res.ok(data);
    }
    catch (err) {
      logger.error('search member fail:', err);
      next(err);
    }
  },

  getMemberDetail: async (req, res, next) => {
    try {
      let { params } = req;
      // let items = await MembershipApi.getMemberDetail(memberId);
      // if (!items.code) {
      //   return res.ok(items.data);
      // }
      // else {
      //   return res.status(parseInt(items.code)).send(items.data);
      // }

      // region memo data
      let data = {
        id: '2',
        name: 'User2',
        membership_type: 'Paid',
        kyc_level: 'KYC 1',
        kyc_status: 'Approved',
        referral_code: '1FE2MK',
        referrer: '0FA2MN',
        create_at: '2020-04-29 15:15:51.676+09'
      }
      //end region
      return res.ok(data);
    }
    catch (err) {
      logger.error('get member detail fail:', err);
      next(err);
    }
  },
  updateMember: async (req, res, next) => {
    try {
      let { body, params } = req;
      // let items = await MembershipApi.updateMember(memberId,body);
      // if (!items.code) {
      //   return res.ok(items.data);
      // }
      // else {
      //   return res.status(parseInt(items.code)).send(items.data);
      // }

      return res.ok(true);
    }
    catch (err) {
      logger.error('get member detail fail:', err);
      next(err);
    }
  },
}