const logger = require("app/lib/logger");
const config = require('app/config');
const WalletPrivKeys = require('app/model/wallet').wallet_priv_keys;
const MemberAsset = require('app/model/wallet').member_assets;
const Sequelize = require('sequelize');
const database = require('app/lib/database').db().wallet;

module.exports = {
  execute: async () => {
    let transaction;
    try {
      const StakingPlatforms = config.stakingPlatform.split(',');
      const day = Math.floor(Date.now() / 86400000);
      const walletPrivKeys = await WalletPrivKeys.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('address')), 'address'], 'platform'],
        where: {
          platform: StakingPlatforms,
          deleted_flg: false
        },
        raw: true
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
              let memberAsset = await MemberAsset.findOne({
                where: {
                  platform: item.platform,
                  address: item.address
                },
                order: [['created_at', 'DESC']]    
              })
              if (memberAsset) {
                let number = day - Math.floor(Date.parse(memberAsset.createdAt)/86400000);
                if (number > 1) {
                  for (let i = number - 1; i > 0; i --) {
                    let date = new Date();
                    date.setDate(date.getDate() - i);
                    insertItems.push ({
                      platform: item.platform,
                      address: item.address,
                      balance: memberAsset.balance,  // balance of account
                      amount: memberAsset.amount,  // balance of staking
                      reward: 0,  // daily reward = current unclaim reward - yesterday unclaim rewad + change of daily unclaim reward  
                      unclaim_reward: 0,// current unclaim reward
                      missed_daily: true,
                      createdAt: date
                    })
                  }
                  insertItems.push ({
                    platform: item.platform,
                    address: item.address,
                    balance: data.balance,  // balance of account
                    amount: data.amount,  // balance of staking
                    reward: data.reward,  // daily reward = current unclaim reward - yesterday unclaim rewad + change of daily unclaim reward  
                    unclaim_reward: data.unclaim_reward ? data.unclaim_reward : 0, // current unclaim reward 
                    tracking: data.opts
                  }) 
                } else if (number == 1) {
                  insertItems.push ({
                    platform: item.platform,
                    address: item.address,
                    balance: data.balance,  // balance of account
                    amount: data.amount,  // balance of staking
                    reward: data.reward,  // daily reward = current unclaim reward - yesterday unclaim rewad + change of daily unclaim reward  
                    unclaim_reward: data.unclaim_reward ? data.unclaim_reward : 0, // current unclaim reward 
                    tracking: data.opts
                  })
                } else if (number == 0) {
                  await MemberAsset.update({
                    balance: data.balance,  // balance of account
                    amount: data.amount,  // balance of staking
                    reward: data.reward,  // daily reward = current unclaim reward - yesterday unclaim rewad + change of daily unclaim reward  
                    unclaim_reward: data.unclaim_reward ? data.unclaim_reward : 0, // current unclaim reward 
                    tracking: data.opts
                  },{
                    where: {
                      id: memberAsset.id
                    },
                    transaction
                  });
                }
              } else {
                insertItems.push ({
                  platform: item.platform,
                  address: item.address,
                  balance: data.balance,  // balance of account
                  amount: data.amount,  // balance of staking
                  reward: data.reward,  // daily reward = current unclaim reward - yesterday unclaim rewad + change of daily unclaim reward  
                  unclaim_reward: data.unclaim_reward ? data.unclaim_reward : 0, // current unclaim reward 
                  tracking: data.opts
                })
              }
            }
          }
          if (insertItems.length > 0) {
            await MemberAsset.bulkCreate(insertItems, { transaction });
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
