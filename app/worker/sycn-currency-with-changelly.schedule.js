const cron = require('node-cron');
const config = require('app/config');
const syncCurrencyWithChangellyJob = require("./job/sycn-currency-with-changelly.job.js");
const runWithLockFile = require('app/lib/run-lock-file');
const SYNC_CURRENCY_WITH_CHANGELLY_LOCK_FILE = 'sycn_currency_with_changelly.lock';

module.exports = {
  run: () => {
    cron.schedule(config.schedule.syncCurrencyWithChangelly, async () => {
      await runWithLockFile(syncCurrencyWithChangellyJob, SYNC_CURRENCY_WITH_CHANGELLY_LOCK_FILE, "sync currency with changelly");
    });
  },
  lockFile: () => SYNC_CURRENCY_WITH_CHANGELLY_LOCK_FILE
};
