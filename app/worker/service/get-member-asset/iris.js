const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');
const config = require('app/config');
const BigNumber = require('bignumber.js');
const InfinitoApi = require('node-infinito-api');
const StakingPlatform = require('app/lib/staking-api/staking-platform');
const MemberAsset = require('app/model/wallet').member_assets;
const api = new InfinitoApi(config.infinitoApiOpts);
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const logHangout = require("app/lib/logger/hangout");
const dbLogger = require('app/lib/logger/db');

class IRIS extends GetMemberAsset {
  constructor() {
    super();
  }

  async getValidators(apiCoin) {
    this.validatorAddresses = await StakingPlatform.getValidatorAddresses('IRIS');
    this.validatorRatio = []
    for (let i of this.validatorAddresses) {
      let validatorData = await apiCoin.getValidator(i)
      if (validatorData && validatorData.data && validatorData.data.tokens) {
        this.validatorRatio.push({
          operator_address: validatorData.data.operator_address,
          tokens: validatorData.data.tokens,
          shares: validatorData.data.delegator_shares
        })
      }
    }
  }

  async get(address) {
    try {
      const apiCoin = api['IRIS'];
      let balance = 0;
      let amount = 0;
      let reward = 0;
      let unclaimReward = 0;
      let date = new Date();
      date.setHours(0, 0, 0, 0);

      if (!this.validatorAddresses) {
        await this.getValidators(apiCoin)
      }

      const balanceResult = await apiCoin.getBalance(address);
      if (balanceResult && balanceResult.data) {
        balance = BigNumber(balanceResult.data.balance).toNumber() * 1e18;
      }

      if (this.validatorAddresses.length > 0) {
        const amountResult = await apiCoin.getListDelegationsOfDelegator(address);
        if (amountResult && amountResult.data.length > 0) {
          amountResult.data.forEach(item => {
            if (this.validatorAddresses.indexOf(item.validator_addr) != -1) {
              let ratio = this.validatorRatio.find(x => x.operator_address == item.validator_addr)
              amount += BigNumber(item.shares).dividedBy(BigNumber(ratio.shares)).multipliedBy(BigNumber(ratio.tokens)).toNumber() * 1e18;
            }
          });
        }
        const rewardResult = await apiCoin.getRewards(address);
        if (rewardResult && rewardResult.data.total.length > 0) {
          for (let e of rewardResult.data.delegations) {
            if (this.validatorAddresses.indexOf(e.validator) != -1) {
              for (let r of e.reward) {
                unclaimReward = unclaimReward + BigNumber(r.amount).toNumber();
              }
            }
          }
          let memberAsset = await MemberAsset.findOne({
            where: {
              platform: 'IRIS',
              address: address,
              missed_daily: false,
              created_at: { [Op.lt]: date }
            },
            order: [['created_at', 'DESC']]
          })
          if (memberAsset) {
            let number = 0;
            let claim = 0;
            let txs = await getHistories(address, memberAsset);
            if (txs.length > 0) {
              for (let tx of txs) {
                if (tx.tx_type = 'get_delegator_rewards_all' && Date.parse(tx.timestamp) >= Date.parse(memberAsset.updatedAt) && tx.validator_addresses && tx.validator_addresses.length > 0) {
                  for (let validator of tx.validator_addresses) {
                    if (this.validatorAddresses.indexOf(validator.validator_address) != -1) {
                      claim = claim + BigNumber(validator.amount).toNumber() * 1e18;
                      logger.info('claim: ', claim);
                    }
                  }
                }
              }
            }
            number = unclaimReward + claim - BigNumber(memberAsset.unclaim_reward).toNumber();
            reward = number > 0 ? number : 0;
          } else {
            reward = unclaimReward;
          }
        }
      }
      return {
        balance: balance,
        amount: amount,
        reward: reward,
        unclaimReward: unclaimReward
      };
    } catch (error) {
      await dbLogger(error,address);
      logger.error(error);
      return null;
    }
  }
}

const getHistories = async (address, memberAsset) => {
  try {
    let params = [
      {
        name: "getAllTransactionHistory",
        method: "GET",
        url: `/chains/v1/IRIS/addr/{addr}/txs?offset={offset}&limit=50`,
        "params": [
          "addr",
          "offset"
        ]
      }
    ];

    api.extendMethod("chains", params, api);

    let offset = 0;
    let limit = 50;
    let total = 0;
    let txs = [];

    do {
      let response = await api.chains.getAllTransactionHistory(address, offset);
      if (!response || !response.data || response.data.txs.length <= 0)
        return txs
      total = response.data.total_count
      offset += limit
      let br = false
      for (let tx of response.data.txs) {
        if (Date.parse(tx.timestamp) >= Date.parse(memberAsset.updatedAt))
          txs.push(tx)
        else {
          br = true
          break
        }
      }
      if (br)
        break;
    }
    while (offset < total)

    return txs;
  } catch (err) {
    logger[err.canLogAxiosError ? 'error' : 'info'](err);
    logHangout.write(JSON.stringify(err));
    await dbLogger(err,address);
    return null
  }
}

module.exports = IRIS;
