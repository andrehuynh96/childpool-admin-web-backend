const AdaPool = require("app/model/wallet").ada_pools;
const AdaPoolNotifyCfg = require("app/model/wallet").ada_pool_notify_cfgs;
const AdaPoolNotifyHis = require("app/model/wallet").ada_pool_notify_his;
const axios = require('axios');
const mailer = require('app/lib/mailer');
const config = require('app/config');
const InfinitoApi = require('node-infinito-api');
const logger = require('app/lib/logger');

const opts = {
  apiKey: config.sdk.apiKey,
  secret: config.sdk.secret,
  baseUrl: config.sdk.url
};
const api = new InfinitoApi(opts);

class CheckAdaPoolNotifyCfg {
  constructor() {
  }

  async check() {
    let pools = await AdaPool.findAll();
    let cfg = await AdaPoolNotifyCfg.findOne();
    let warningPools = [];
    let lastBlock = await this.getBestBlock();
    if (lastBlock && pools && pools.length > 0 && cfg && cfg.is_enabled == true) {
      for (let e of pools) {
        let result = await axios.get(`https://js.adapools.org/pools/${e.address}/summary.json`);
        let poolInfo = result.data.data;
        if (parseFloat(poolInfo.total_stake) / 1e6 > cfg.size) {
          poolInfo.link = `https://adapools.org/pool/${poolInfo.pool_id}`;
          warningPools.push(poolInfo);
        }
      }
    }

    if (warningPools.length > 0) {
      let models = [];
      warningPools.forEach(pool => {
        models.push({
          epoch: lastBlock.epoch,
          slot: lastBlock.slot,
          block: lastBlock.height,
          name: pool.db_name,
          size: parseFloat(pool.total_stake) / 1e6
        });
      });
      await AdaPoolNotifyHis.bulkCreate(
        models, {
        returning: true
      });

      const emails = cfg.emails.split(',').map(item => (item || '').trim()).filter(item => !!item);
      await this.sendMail(emails, warningPools);
      return true;
    }
    return false;
  }

  async sendMail(listEmail, poolInfos) {
    let subject = ` ${config.emailTemplate.partnerName} - ADA Pools are over capacity`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      pools: poolInfos
    };
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, listEmail, data, config.emailTemplate.adaPoolNotification);
  }

  async getBestBlock() {
    try {
      let params = [
        {
          name: "getBestBlock",
          method: "GET",
          url: '/chains/v1/ADA/bestblock'
        }
      ];

      api.extendMethod("chains", params, api);
      const response = await api.chains.getBestBlock();
      if (response.data && response.cd == 0) {
        return response.data;
      } else {
        return null;
      }
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('getBestBlock', err);

      return null;
    }
  }
}
module.exports = CheckAdaPoolNotifyCfg;
