const cron = require('node-cron');
const config = require('app/config');
const syncCacheCoinGecko = require("./job/sync-cache-coin-gecko.job");
const runWithLockFile = require('app/lib/run-lock-file');
const SYNC_CACHE_COIN_GECKO_LOCK_FILE = 'sync_cache_coin_gecko.lock';

module.exports = {
  run: () => {
    if (!config.schedule.syncCacheCoinGecko) {
      return;
    }

    cron.schedule(config.schedule.syncCacheCoinGecko, async () => {
      await runWithLockFile(syncCacheCoinGecko, SYNC_CACHE_COIN_GECKO_LOCK_FILE, "sync cache coin gecko", false);
    });

  },
  lockFile: () => SYNC_CACHE_COIN_GECKO_LOCK_FILE
};
