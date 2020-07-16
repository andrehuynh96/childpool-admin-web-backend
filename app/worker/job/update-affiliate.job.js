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
      let coins = ["ATOM", "IRIS", "ONT"];
      for (let element of coins) {
        // call account distribution
        let offset = 0
        let limit = 20
        while (true) {
          let qr = await AccountContributionAPI.get(element, limit, offset);
          qr = qr.data;
          let contributions = qr.items
          if (qr.items.length <= 0)
            break;
          let ids = []
          let affiliatePayload = {
            currency_symbol: element,
            from_date: contributions[0].created_at,
            to_date: contributions[contributions.length - 1].created_at,
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
              }
            }
          });
          contributions.forEach(async (contribution) => {
            let address = contribution.address;
            let amount = contribution.amount;
            let w = wallets.find(x => x.privKeys.filter(t => t.address == address));
            let email = w.member.email;
            affiliatePayload.details.push({
              ext_client_id: email,
              amount: amount
            })
            ids.push(contribution.id);
          })
          // update affiliate
          const result = await affiliateApi.setRewardRequest(affiliatePayload);
          if (result.httpCode == 200) {
            // update account contribution
            await AccountContributionAPI.set(element, {
              ids: ids,
              affiliate_reward_id: result.data.id
            })
          }
          if (qr.limit + qr.offset >= qr.total) {
            break;
          }
          else {
            offset = qr.offset + qr.limit;
          }
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }
}