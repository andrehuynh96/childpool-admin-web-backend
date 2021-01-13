const cron = require('node-cron');
const config = require('app/config');
const getMemberAsset = require("./job/get-member-asset.job");
const runWithLockFile = require('app/lib/run-lock-file');
const GET_MEMBER_ASSET_LOCK_FILE = 'get_member_asset.lock';
const logHangout = require("app/lib/logger/hangout");
const logger = require("app/lib/logger");

module.exports = {
  run: () => {
    cron.schedule(config.schedule.getMemberAsset, async () => {
      let name = 'get member asset';
      var id = Math.floor(new Date().getTime() / 1000)
      logger.info(`START: ${name} ${id}`);
      logHangout.write(`START: ${name} ${id}`);
      try {
        await getMemberAsset.execute();
      } catch (err) {
        logger.error(`Can not start ${name}. ${err}`);
      }
      logger.info(`FINISH: ${name} ${id}`);
      logHangout.write(`FINISH: ${name} ${id}`);
    });

  },
  lockFile: () => GET_MEMBER_ASSET_LOCK_FILE
};
