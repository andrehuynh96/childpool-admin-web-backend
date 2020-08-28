const cron = require('node-cron');
const config = require('app/config');
const getBalanceAmount = require("./job/get-balance-amount");
const runWithLockFile = require('app/lib/run-lock-file');
const GET_BALANCE_AMOUNT_LOCK_FILE = 'get_balance_amount.lock';

module.exports = {
    run: () => {
      cron.schedule(config.schedule.getBalanceAmount, async () => {
        await runWithLockFile(getBalanceAmount, GET_BALANCE_AMOUNT_LOCK_FILE, "get balance amount");
      });
    }
  }