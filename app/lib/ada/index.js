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
}