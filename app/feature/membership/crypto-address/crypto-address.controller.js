const _ = require('lodash');
const logger = require("app/lib/logger");
const MembershipType = require("app/model/wallet").membership_types;
const MemberAccount = require("app/model/wallet").member_accounts;
const Sequelize = require('sequelize');
const db = require('app/model/wallet').sequelize;

const Op = Sequelize.Op;

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const offset = query.offset ? parseInt(query.offset) : 0;
      const { platform, membership_type_id, email, address, is_reward_address } = query;
      const filters = ['1=1'];
      const filterData = {};
      let rewardWallets;

      const hasFilerRewardAddress = is_reward_address == 'true';
      if (hasFilerRewardAddress) {
        const cond = {
          type: 'Crypto',
          deleted_flg: false,
        };
        if (platform) {
          cond.currency_symbol = platform;
        }

        const memberAccounts = await MemberAccount.findAll({
          where: cond,
        });

        rewardWallets = memberAccounts.filter(item => item.wallet_id).map(item => {
          return {
            member_id: item.member_id,
            currency_symbol: item.currency_symbol,
            wallet_address: item.wallet_address,
            wallet_id: item.wallet_id,
          };
        });
      }

      if (rewardWallets && rewardWallets.length) {
        const walletIdList = _.uniq(rewardWallets.map(item => `'${item.wallet_id}'`));
        filters.push(`wpk.wallet_id IN ( ${walletIdList.join(',')} )`);
      }

      if (platform) {
        filters.push('wpk.platform = :platform');
        filterData.platform = platform;
      }

      if (membership_type_id) {
        filters.push('m.membership_type_id = :membership_type_id');
        filterData.membership_type_id = membership_type_id;
      }

      if (email) {
        filters.push('m.email ILIKE :email');
        filterData.email = `%${email}%`;
      }

      if (address) {
        filters.push('wpk.address ILIKE :address');
        filterData.address = `%${address}%`;
      }

      let total = 0;
      let items = [];
      const countSQL = `
      select
        count(w.id)
      from
        public.wallet_priv_keys wpk
      join public.wallets w on
        wpk.wallet_id = w.id
        and wpk.deleted_flg = false
      join public.members m on
        w.member_id = m.id
        and w.deleted_flg = false
      where
        (${filters.join(' and ')})
      `;
      // console.log(countSQL);
      const [countResult] = await db.query(countSQL,
        {
          replacements: {
            ...filterData,
          },
        },
        {
          type: db.QueryTypes.SELECT,
        });
      total = Number(countResult[0].count);

      if (!total) {
        return res.ok({
          items,
          offset: offset,
          limit: limit,
          total: total
        });
      }

      const querySQL = `
    select
      w.name as wallet_name,
      w.member_id,
      wpk.platform as platform,
      wpk.address as wallet_address,
      wpk.created_at,
      m.email as member_email,
      m.first_name,
      m.last_name,
      m.kyc_level,
      m.kyc_status,
      m.membership_type_id
    from
      public.wallet_priv_keys wpk
    join public.wallets w on
      wpk.wallet_id = w.id
      and wpk.deleted_flg = false
    join public.members m on
      w.member_id = m.id
      and w.deleted_flg = false
    where
      (${filters.join(' and ')})
    order by
      wallet_name asc,
      platform asc,
      wallet_address asc,
      member_email asc
    limit :limit offset :offset
    `;
      // console.log(querySQL);
      const result = await db.query(querySQL,
        {
          replacements: {
            ...filterData,
            limit,
            offset,
          },
        },
        {
          type: db.QueryTypes.SELECT,
        });

      items = result[0];
      const membershipTypeIdlist = _.uniq(items.filter(item => item.membership_type_id).map(item => item.membership_type_id));
      const tasks = [];
      const getMembershipTypesTask = await MembershipType.findAll({
        where: {
          id: {
            [Op.in]: membershipTypeIdlist,
          }
        }
      });
      tasks.push(getMembershipTypesTask);

      if (!hasFilerRewardAddress) {
        const memberIdList = _.uniq(items.map(item => item.member_id));
        const cond = {
          type: 'Crypto',
          deleted_flg: false,
          member_id: {
            [Op.in]: memberIdList,
          }
        };
        const getMemberAccountsTask = await MemberAccount.findAll({
          where: cond,
        });

        tasks.push(getMemberAccountsTask);
      }

      // eslint-disable-next-line no-unused-vars
      let [membershipTypes, memberAccounts] = await Promise.all(tasks);
      memberAccounts = memberAccounts || [];
      // eslint-disable-next-line no-unused-vars
      const generateKey = (member_id, currency_symbol, wallet_address, wallet_id) => {
        return [member_id, currency_symbol, wallet_address].join('_');
      };
      const rewardAddressCache = memberAccounts.reduce((result, memberAccount) => {
        const key = generateKey(memberAccount.member_id, memberAccount.currency_symbol, memberAccount.wallet_address, memberAccount.wallet_id);
        result[key] = true;

        return result;
      }, {});

      items.forEach(item => {
        const membershipType = membershipTypes.find(x => x.id === item.membership_type_id);
        item.membership_type = membershipType ? membershipType.name : 'Basic';

        // Fill reward address flag
        if (hasFilerRewardAddress) {
          item.is_reward_address = true;
        } else {
          const key = generateKey(item.member_id, item.platform, item.wallet_address, item.wallet_id);
          item.is_reward_address = !!rewardAddressCache[key];
        }

        item.kyc_level = (item.kyc_level || '').replace('LEVEL_', '');
      });

      return res.ok({
        items,
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (error) {
      logger.info('search currency address fail', error);
      next(error);
    }
  }
};

