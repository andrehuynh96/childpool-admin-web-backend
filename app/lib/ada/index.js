const config = require("app/config");
const logger = require("app/lib/logger");
const axios = require("axios");
const sleep = require('sleep-promise');

module.exports = {
  getTransactionDetail: async ({ address, until_block, after_block = '', after_tx = '' }) => {
    try {
      let after = {};
      if (after_block && after_tx) {
        after.after = {
          block: after_block,
          tx: after_tx
        }
      }
      let result = await axios.post(`${config.ADA.restUrl}/v2/txs/history`,
        {
          addresses: [address],
          untilBlock: until_block,
          ...after
        });
      return result.data;
    }
    catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']("ADA:: getTransactionHistory error::", err);
      throw err;
    }
  },

  getLatestBlock: async () => {
    try {
      let result = await axios.get(`${config.ADA.restUrl}/v2/bestblock`);
      return result.data;
    }
    catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']("ADA:: getLatestBlock error::", err);
      throw err;
    }
  },

  getActiveStakeAddress: async ({ validators, epoch, limit = 1000, delegators = [] }) => {
    try {
      let result = await axios.post(`${config.ADA.graphqlUrl}`, {
        query: `query activeStakeForAddress (
          $limit: Int!
          $where: ActiveStake_bool_exp 
      ) {
          activeStake (limit: $limit, where: $where) {
              address
              amount
              epoch {
                  number
              }
              epochNo
              registeredWith {
                  hash
              }
          }
      }`,
        variables: {
          limit: limit,
          where: {
            address: delegators.length == 0 ? {} : { "_in": delegators },
            epoch: {
              number: {
                "_eq": epoch
              }
            },
            registeredWith: validators.length == 0 ? {} : {
              id: {
                "_in": validators
              }
            }
          }
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return result.data;
    }
    catch (err) {
      console.log(err)
      logger.error(`ADA:: getActiveStakeAddress error::`, err);
      throw err;
    }
  },

  getCurrentEpoch: async () => {
    try {
      let result = await axios.post(`${config.ADA.graphqlUrl}`, {
        query: `query cardanoDynamic {  cardano {    tip {      number      slotInEpoch      forgedAt      protocolVersion    }    currentEpoch {      number   }  }}`,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return result.data.data.cardano.currentEpoch.number;
    }
    catch (err) {
      console.log(err);
      logger.error(`ADA:: getCurrentEpoch error::`, err);
      throw err;
    }
  },
}