const cron = require('node-cron');
const config = require('app/config');
const getMemberAsset = require("./job/get-member-asset.job");
const runWithLockFile = require('app/lib/run-lock-file');
const GET_MEMBER_ASSET_LOCK_FILE = 'get_member_asset.lock';

module.exports = {
  run: async () => {
    ///cron.schedule(config.schedule.getMemberAsset, async () => {
    //  await runWithLockFile(getMemberAsset, GET_MEMBER_ASSET_LOCK_FILE, "get member asset", true);
    //});
    await getMemberAsset.execute();
  },
  lockFile: () => GET_MEMBER_ASSET_LOCK_FILE
};
