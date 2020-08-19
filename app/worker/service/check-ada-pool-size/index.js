const AdaPool = require("app/model/wallet").ada_pools
const AdaPoolNotifyCfg = require("app/model/wallet").ada_pool_notify_cfgs
const axios = require('axios');
const mailer = require('app/lib/mailer');
const config = require('app/config');

class CheckAdaPoolNotifyCfg {
    constructor() {
    }
  
    async check() {
      let pools = await AdaPool.findAll();
      let cfg = await AdaPoolNotifyCfg.findOne();
      let warningPools = []
      if (pools && pools.length > 0 && cfg) {
        for (let e of pools) {
          let result = await axios.get(`https://js.adapools.org/pools/${e.address}/summary.json`)
          let poolInfo = result.data.data
          if(parseFloat(poolInfo.total_stake)/1e6 > cfg.size){
            poolInfo.link = `https://adapools.org/pool/${poolInfo.pool_id}`
            warningPools.push(poolInfo)
          }
        }
      }
      if(warningPools.length > 0){
        await this.sendMail(cfg.emails, warningPools)
        return true
      }
      return false
    }

    async sendMail(listEmail, poolInfos){
      let subject = ` ${config.emailTemplate.partnerName} - ADA Pools are over capacity`;
      let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
      let data = {
        imageUrl: config.website.urlImages,
        pools: poolInfos
      }
      data = Object.assign({}, data, config.email);
      await mailer.sendWithTemplate(subject, from, listEmail, data, config.emailTemplate.adaPoolNotification);
    }
  }
  module.exports = CheckAdaPoolNotifyCfg;