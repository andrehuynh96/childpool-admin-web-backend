const cron = require('node-cron');
const config = require('app/config');
const UpdateAffiliateJob = require("./job/update-affiliate.job");
const runWithLockFile = require('app/lib/run-lock-file');
const UPDATE_AFFILIATE_LOCK_FILE = 'update_affliate.lock';

module.exports = {
  run: () => {
    if (!config.schedule.checkTransactionReward) {
      return;
    }

    cron.schedule(config.schedule.checkTransactionReward, async () => {
      await runWithLockFile(UpdateAffiliateJob, UPDATE_AFFILIATE_LOCK_FILE, "update affiliate");
    });
  },
  lockFile: () => UPDATE_AFFILIATE_LOCK_FILE
};
