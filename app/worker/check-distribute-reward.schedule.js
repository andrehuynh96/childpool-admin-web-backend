const cron = require('node-cron');
const config = require('app/config');
const CheckDistributeRewardJob = require("./job/check-distribute-reward.job");
const runWithLockFile = require('app/lib/run-lock-file');
const CHECK_TRANSACTION_REWARD_LOCK_FILE = 'check_distribute_reward.lock';

module.exports = {
  run: () => {
    cron.schedule(config.schedule.checkTransactionReward, async () => {
      await runWithLockFile(CheckDistributeRewardJob, CHECK_TRANSACTION_REWARD_LOCK_FILE, "check transaction reward");
    });
  }
}