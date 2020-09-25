const logger = require("app/lib/logger");
const config = require('app/config');
const WalletPrivKeys = require('app/model/wallet').wallet_priv_keys;
const MemberAsset = require('app/model/wallet').member_assets;
const Sequelize = require('sequelize');
const database = require('app/lib/database').db().wallet;
const Op = Sequelize.Op;

module.exports = {
  execute: async () => {
    let transaction;
    try {
      const StakingPlatforms = config.stakingPlatform.split(',');
      const day = Math.floor(Date.now() / 86400000);
      const walletPrivKeys = await WalletPrivKeys.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('address')), 'address'], 'platform', 'run_batch_day', 'try_batch_num'],
        where: {
          platform: StakingPlatforms,
          run_batch_day: { [Op.lt]: day },
          deleted_flg: false
        },
        raw: true,
        order: [['try_batch_num', 'ASC']]
      });
      for (let platform of StakingPlatforms) {
        let serviceName = platform.toLowerCase().trim();
        let Service = require(`../service/get-member-asset/${serviceName}.js`);
        let service = new Service();
        let insertItems = [];
        if (service) {
          let items = walletPrivKeys.filter(e => e.platform.toUpperCase().trim() == platform.toUpperCase().trim());
          transaction = await database.transaction();
          for (let item of items) {
            logger.info('Waiting for',item.platform,'response');
            let data = await service.get(item.address);
            logger.info(item.platform,data);
            if (data) {
              insertItems.push ({
                platform: item.platform,
                address: item.address,
                balance: data.balance,  // balance of account
                amount: data.amount,  // balance of staking
                reward: data.reward,  // daily reward = current unclaim reward - yesterday unclaim rewad + change of daily unclaim reward  
                unclaim_reward: data.unclaimReward ? data.unclaimReward : 0, // current unclaim reward 
                tracking: data.opts
              })  
            } else {
              await WalletPrivKeys.update({
                try_batch_num: parseInt(item.try_batch_num) + 1
              },{
                where: {
                  address: item.address
                },
                transaction
              });
            }
          }
          if (insertItems.length > 0) {
            await MemberAsset.bulkCreate(insertItems, { transaction });
            await WalletPrivKeys.update({
              run_batch_day: day,
              try_batch_num: 0
            }, {
              where: {
                address: insertItems.map(e => e.address)
              }, transaction
            });
          }
          await transaction.commit();
        }
      }
      return true;
    }
    catch (err) {
      logger.error("get balance and amount job error:", err);
      if (transaction)
        await transaction.rollback();
    }
  }
};
