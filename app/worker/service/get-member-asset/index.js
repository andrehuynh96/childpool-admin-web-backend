const logger = require('app/lib/logger');
const WalletPrivKeys = require('app/model/wallet').wallet_priv_keys;
const MemberAsset = require('app/model/wallet').member_assets;
const GetBalanceAmountLib = require('app/lib/address/member-asset');
const stakingPlatform = ['IRIS', 'ATOM', 'ONT', 'XTZ', 'ONE', 'ADA', 'QTUM'];
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
class GetBalanceAmountAddress {
  constructor() {
  }
  async get() {
    try {
      const dayOfYear = Math.floor((Date.now() - Date.parse(new Date().getFullYear(), 0, 0)) / 86400000);
      const walletPrivKeys = await WalletPrivKeys.findAll({
        attributes: ['address', 'platform', 'run_batch_day', 'try_batch_num'],
        where: {
          platform: stakingPlatform,
          run_batch_day: { [Op.lt]: dayOfYear }
        },
        raw: true,
        order: [['try_batch_num', 'ASC']]
      });
      for (let item of walletPrivKeys) {
        console.log('Waiting for',item.platform,'response');
        const data = await GetBalanceAmountLib.getAsset(item.platform, item.address);
        console.log(item.platform,data);
        if (data.balance && data.amount && data.reward) {
          await MemberAsset.create({
            platform: item.platform,
            address: item.address,
            balance: data.balance,
            amount: data.amount,
            reward: data.reward
          });
          await WalletPrivKeys.update({
            run_batch_day: dayOfYear
          }, {
            where: {
              address: item.address
            }
          });
        }
        else {
          await WalletPrivKeys.update({
            try_batch_num: parseInt(item.try_batch_num) + 1
          },{
            where: {
              address: item.address
            }
          });
        }
      }

      return true;
    }
    catch (error) {
      logger.error('insert member asset fail', error);
    }
  }
}
module.exports = GetBalanceAmountAddress;
