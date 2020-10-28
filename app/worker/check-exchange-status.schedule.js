const cron = require('node-cron');
const config = require('app/config');
const CheckExchangeStatusJob = require("./job/check-exchange-status.job");
const runWithLockFile = require('app/lib/run-lock-file');
const LOCK_FILE = 'check_exchange_status.lock';

module.exports = {
  run: () => {
    cron.schedule(config.schedule.checkExchangeStatus, async () => {
      await runWithLockFile(CheckExchangeStatusJob, LOCK_FILE, "check exchange status");
    });
  },
  lockFile: () => LOCK_FILE
}