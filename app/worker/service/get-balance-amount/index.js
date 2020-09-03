const Wallet = require('app/model/wallet').wallets;
const WalletPrivKeys = require('app/model/wallet').wallet_priv_keys;
const memberTrackingVote = require('app/model/wallet').member_tracking_votes;
const GetBalanceAmountLib = require('app/lib/address/balance-amount');
// const stakingPlatform = ['IRIS','ATOM','ONT','XTZ','ONE','ADA','QTUM'];
const stakingPlatform = ['ATOM','ONT','XTZ','ONE','TADA','QTUM'];
class GetBalanceAmountAddress {
    constructor() {
    }
    async get() {
        const walletPrivKeys = await WalletPrivKeys.findAll({
            attributes: ['address','platform'],
            include: [
                {
                  attributes: ['member_id'],
                  as: "Wallet",
                  model: Wallet,
                  required: true
                }
              ],
              where: {
                  platform: stakingPlatform
              },
              raw: true,
        });

        let result = [];
        for (let item of walletPrivKeys) {
            const data = await GetBalanceAmountLib.getBalanceAmount(item.platform,item.address);
            if (data) {
                result.push({
                    address: item.address,
                    platform: item.platform,
                    member_id: item['Wallet.member_id'],
                    balance: data.balance,
                    amount: data.amount
                });
            }
        }
        await memberTrackingVote.bulkCreate(result);
        return true;
    }
}
module.exports = GetBalanceAmountAddress;
