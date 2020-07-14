const cron = require('node-cron');
const config = require('app/config');
const UpdateAffiliateJob = require("./job/update-affiliate.job");
const runWithLockFile = require('app/lib/run-lock-file');
const UPDATE_AFFILIATE_LOCK_FILE = 'withdraw_cold_wallet.lock';

module.exports = {
  run: () => {
    cron.schedule(config.schedule.updateAffiliate, async () => {
      await runWithLockFile(UpdateAffiliateJob, UPDATE_AFFILIATE_LOCK_FILE, "withdrawal cold wallet");
    });
  }
}