const _ = require('lodash');
const logger = require("app/lib/logger");
// const Wallet = require("app/model/wallet").wallets;
// const WalletPrivateKey = require("app/model/wallet").wallet_priv_keys;
// const Member = require("app/model/wallet").members;
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
            currency_symbol: item.currency_symbol,
            wallet_id: item.wallet_id,
          };
        });
      }

      // console.log(rewardWallets);
      if (rewardWallets && rewardWallets.length) {
        const walletIdList = _.uniq(rewardWallets.map(item => `'${item.wallet_id}'`));
        filters.push(`wpk.wallet_id IN ( ${walletIdList.join(',')} )`);
        // filterData.platform = platform;
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

      console.log(countSQL);
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
      const membershipTypes = await MembershipType.findAll();

      items.forEach(item => {
        const membershipType = membershipTypes.find(x => x.id === item.membership_type_id);
        item.membership_type = membershipType ? membershipType.name : 'Basic';

        item.is_reward_address = hasFilerRewardAddress;
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

