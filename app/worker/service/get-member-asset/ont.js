const GetMemberAsset = require("./base");
const axios = require('axios');
const logger = require('app/lib/logger');
const config = require('app/config');
const BigNumber = require('bignumber.js');
const StakingPlatform = require('app/lib/staking-api/staking-platform');
const MemberAsset = require('app/model/wallet').member_assets;
const sleep = require('sleep-promise');
const { RestClient, GovernanceTxBuilder, Crypto } = require('ontology-ts-sdk');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const logHangout = require("app/lib/logger/hangout");
const dbLogger = require('app/lib/logger/db');

class ONT extends GetMemberAsset {
  constructor() {
    super();
    this.network = config.ONT.restUrl;
    this.parserNetwork = config.ONT.parserUrl;
    this.rest = new RestClient(this.network);
  }
  async get(address) {
    try {
      const userAddr = new Crypto.Address(address);

      let balance = 0;
      let amount = 0;
      let reward = 0;
      let unclaimReward = 0;
      let date = new Date();
      date.setHours(0, 0, 0, 0);

      var getAddressBalance = await this.rest.getBalance(userAddr);
      if (getAddressBalance && getAddressBalance.Error == 0 && getAddressBalance.Result) {
        balance = BigNumber(getAddressBalance.Result.ont).toNumber();
      }

      let peerPubkeys = await StakingPlatform.getValidatorAddresses('ONT');
      let address_unbound_ong = config.ONT.addressUnboundOng; // "AFmseVrdL9f9oyCzZefL9tG6UbvhUMqNMV";
      let address_staking_ont = config.ONT.addressStakingOnt; // "AFmseVrdL9f9oyCzZefL9tG6UbviEH9ugK";

      if (peerPubkeys && peerPubkeys.length && peerPubkeys.length > 0) {
        for (let index = 0; index < peerPubkeys.length; index++) {
          const validatorPeerPubkey = peerPubkeys[index];
          const authorizeInfo = await GovernanceTxBuilder.getAuthorizeInfo(validatorPeerPubkey, userAddr, this.network);
          if (authorizeInfo) {
            const { consensusPos, freezePos, newPos } = authorizeInfo;
            amount += consensusPos + freezePos + newPos;
          }
        }
      }

      // GET unclaimReward
      let myValidatorStakingRate = 0;
      const splitFee = await GovernanceTxBuilder.getSplitFeeAddress(userAddr, this.network);
      if (splitFee && amount > 0) {
        // unclaimReward = BigNumber(splitFee.amount).toNumber();
        let totalUnclaimReward = BigNumber(splitFee.amount).toNumber();
        const peerMap = await GovernanceTxBuilder.getPeerPoolMap(this.network);
        var totalSakingAmount = 0;
        for (var nodePubKey in peerMap) {
          let authorizeInfo = await GovernanceTxBuilder.getAuthorizeInfo(nodePubKey, userAddr, this.network);
          if (authorizeInfo) {
            const { consensusPos, freezePos, newPos } = authorizeInfo;
            totalSakingAmount += (consensusPos + freezePos + newPos);
          }
        }
        myValidatorStakingRate = amount / totalSakingAmount;
        unclaimReward = totalUnclaimReward * myValidatorStakingRate;
      }

      // Calculate daily reward
      let memberAsset = await MemberAsset.findOne({
        where: {
          platform: 'ONT',
          address: address,
          missed_daily: false,
          created_at: {
            [Op.lt]: date
          }
        },
        order: [
          ['created_at', 'DESC']
        ]
      });

      if (memberAsset) {
        let number = 0;
        let fromSecondEpoch = Date.parse(memberAsset.updatedAt) / 1000;
        let claimInOng = await getClaimAmount(this.parserNetwork, address, address_unbound_ong, address_staking_ont, fromSecondEpoch);
        let claim = (claimInOng * 1e9) * myValidatorStakingRate;
        number = unclaimReward + claim - BigNumber(memberAsset.unclaim_reward).toNumber();
        reward = number > 0 ? number : 0;
      } else {
        reward = unclaimReward;
      }

      return {
        balance: balance,
        amount: amount,
        reward: reward,
        unclaimReward: unclaimReward
      };
    } catch (error) {
      logger.error(error);
      logHangout.write(JSON.stringify(error));
            await dbLogger(error,address);
            return null;
    }
  }
}

async function getClaimAmount(parserUrl, address, address_unbound_ong, address_staking_ont, fromSecondEpoch) {
  try {
    let doFetch = true;
    let pageNumFetch = 1;
    let pageSizeFetch = 20;
    let claim = 0;

    while (doFetch) {
      let urlTxs = `${parserUrl}/v2/addresses/${address}/txs?page_size=${pageSizeFetch}&page_number=${pageNumFetch}`;
      let options = {
        method: 'GET',
        url: urlTxs,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await axios(options);
      if (response && response.status == 200 && response.data && response.data.result) {
        doFetch = (pageSizeFetch * pageNumFetch) < response.data.result.total;

        for (let idx = 0; idx < response.data.result.records.length; idx++) {
          let tx = response.data.result.records[idx];

          if (tx.tx_time >= fromSecondEpoch) {
            let fromAddr = tx.transfers[0].from_address;
            let amount = tx.transfers[0].amount;
            if (fromAddr == address_staking_ont) {
              claim += BigNumber(amount).toNumber();
            }
          } else {
            doFetch = false;
            break;
          }

        }

        pageNumFetch++;
        if (doFetch) {
          await sleep(1000);
        }
      } else {
        doFetch = false;
      }
    }
    return claim;
  } catch (err) {
    dbLogger(err,address);
    logger.error(err);
    return 0;
  }
}

module.exports = ONT;
