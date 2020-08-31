const Wallet = require('app/model/wallet').wallets;
const WalletPrivKeys = require('app/model/wallet').wallet_priv_keys;
const memberTrackingVote = require('app/model/wallet').member_tracking_votes;
const GetBalanceAmountLib = require('app/lib/address/balance-amount');
class GetBalanceAmountAddress {
    constructor() {
    }
    async get() {
        const walletPrivKeys = await WalletPrivKeys.findOne({
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
                  platform: 'XTZ'
              },
              raw: true,
        });
        // is Todo:
        // call function get balance and amount from lib
        const data = await GetBalanceAmountLib.getBalanceAmount(walletPrivKeys.platform,walletPrivKeys.address);
        // console.log(data);
        //

        // const data = walletPrivKeys.map(item => {
        //     return {
        //         member_id: item['Wallet.member_id'],
        //         platform: item.platform,
        //         address: item.address,
        //     };
        // });

        // await memberTrackingVote.bulkCreate(data);
        return true;
    }
}
module.exports = GetBalanceAmountAddress;
