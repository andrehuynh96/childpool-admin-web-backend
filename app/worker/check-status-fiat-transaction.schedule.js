const cron = require('node-cron');
const config = require('app/config');
const checkFiatTransaction = require("./job/check-status-fiat-transaction.job");
const runWithLockFile = require('app/lib/run-lock-file');
const CHECK_STATUS_FIAT_TRANSACTION_LOCK_FILE = 'check_status_fiat_transaction.lock';

module.exports = {
  run: () => {
    if (!config.schedule.checkStatusFiatTransaction) {
      return;
    }

    cron.schedule(config.schedule.checkStatusFiatTransaction, async () => {
      await runWithLockFile(checkFiatTransaction, CHECK_STATUS_FIAT_TRANSACTION_LOCK_FILE, "check status fiat transaction", true);
    });
  },
  lockFile: () => CHECK_STATUS_FIAT_TRANSACTION_LOCK_FILE
};
