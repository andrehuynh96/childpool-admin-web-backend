const AccountContributionAPI = require("../../lib/staking-api/account-contribution")
const Wallet = require('../../model/wallet').wallets
const Member = require('../../model/wallet').members
const WalletPrivateKey = require('../../model/wallet').wallet_priv_keys
const { affiliateApi } = require('app/lib/affiliate-api');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  execute: async () => {
    try {
      let coins = ["IRIS", "ATOM", "ONT"];//, "ATOM", "ONT"
      for (let element of coins) {
        // call account distribution
        let offset = 0;
        let limit = 100;
        let response = [];
        while (true) {
          let fromDate = new Date();
          let qr = await AccountContributionAPI.get(element, limit, offset);
          qr = qr.data;
          let contributions = qr.items
          if (qr.items.length <= 0)
            break;
          let ids = []
          let affiliatePayload = {
            currency_symbol: element,
            from_date: fromDate,
            details: []
          }
          let addresses = contributions.map(x => x.address);
          // find wallet_id 
          let walletIds = await WalletPrivateKey.findAll({
            attributes: ['id', 'wallet_id'],
            where: {
              address: {
                [Op.in]: addresses
              },
              deleted_flg: false
            }
          });

          walletIds = walletIds.map(x => x.wallet_id);

          // find user of address
          let wallets = await Wallet.findAll({
            include: [
              {
                as: 'member',
                model: Member,
                where: {
                  deleted_flg: false
                },
                required: true
              },
              {
                as: 'privKeys',
                model: WalletPrivateKey,
                where: {
                  deleted_flg: false
                },
                required: true
              },
            ],
            where: {
              id: {
                [Op.in]: walletIds
              },
              deleted_flg: false
            },
            order: [['created_at', 'ASC']]
          });
          for (let contribution of contributions) {
            let address = contribution.address;
            let amount = contribution.amount;
            let w = wallets.find(x => x.privKeys.filter(t => t.address == address).length > 0);
            if (!w || !w.member || w.member.affiliate_id <= 0) {
              continue;
            }
            let email = w.member.email;

            let ix = affiliatePayload.details.findIndex(x => x.ext_client_id == email);
            if (ix == -1) {
              affiliatePayload.details.push({
                ext_client_id: email,
                amount: amount
              });
            }
            else {
              affiliatePayload.details[ix].amount += amount;
            }
            ids.push(contribution.id);
          }

          if (affiliatePayload.details.length > 0) {
            affiliatePayload.to_date = new Date();
            const result = await affiliateApi.setRewardRequest(affiliatePayload);
            if (result.httpCode == 200) {
              response.push({
                ids: ids,
                affiliate_reward_id: result.data.id
              });
            }
          }

          if (qr.limit + qr.offset >= qr.total) {
            break;
          }
          else {
            offset = qr.offset + qr.limit;
          }
        }
        if (response && response.length > 0) {
          for (let e of response) {
            // update account contribution
            await AccountContributionAPI.set(element, {
              ids: e.ids,
              affiliate_reward_id: e.affiliate_reward_id
            })
          }
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }
}