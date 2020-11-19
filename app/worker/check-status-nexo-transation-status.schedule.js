const cron = require('node-cron');
const config = require('app/config');
const checkNexoTransaction = require("./job/check-status-nexo-transaction.job");
const runWithLockFile = require('app/lib/run-lock-file');
const CHECK_STATUS_NEXO_TRANSACTION_LOCK_FILE = 'check_status_nexo_transaction.lock';

module.exports = {
  run: () => {
    cron.schedule(config.schedule.checkStatusFiatTransaction, async () => {
      await runWithLockFile(checkNexoTransaction, CHECK_STATUS_NEXO_TRANSACTION_LOCK_FILE, "check status nexo transaction", true);
    });
  },
  lockFile: () => CHECK_STATUS_NEXO_TRANSACTION_LOCK_FILE
};
