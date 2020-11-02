const cron = require('node-cron');
const config = require('app/config');
const CheckAdaPoolSizeJob = require("./job/check-ada-pool-size.job");
const runWithLockFile = require('app/lib/run-lock-file');
const CHECK_ADA_POOL_SIZE_LOCK_FILE = 'check_ada_pool_size.lock';

module.exports = {
  run: () => {
    cron.schedule(config.schedule.checkAdaPoolSize, async () => {
      await runWithLockFile(CheckAdaPoolSizeJob, CHECK_ADA_POOL_SIZE_LOCK_FILE, "check ada pool size");
    });
  },
  lockFile: () => CHECK_ADA_POOL_SIZE_LOCK_FILE
}