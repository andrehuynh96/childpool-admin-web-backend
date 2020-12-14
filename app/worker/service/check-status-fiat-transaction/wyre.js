/* eslint-disable no-useless-catch */
const config = require('app/config');
const logger = require('app/lib/logger');
const axios = require('axios');
const Fiat = require("./base");

class Wyre extends Fiat {
  constructor() {
    super();
  }

  async getTransaction({ transferId }) {
    try {
      const path = `/v2/transfer/${transferId}/track`;
      let response = await axios.get(config.fiat.wyre.url + path);
      return response.data;
    }
    catch (err) {
      // logger.error(`Wyre get transaction error:`, err);
      throw err;
    }
  }

  async getOrder({ orderId }) {
    try {
      const path = `/v3/orders/${orderId}`;
      let response = await axios.get(config.fiat.wyre.url + path);
      return response.data;
    }
    catch (err) {
      // console.error(`Wyre get order error:`, err);
      throw err;
    }
  }
}

module.exports = Wyre;
