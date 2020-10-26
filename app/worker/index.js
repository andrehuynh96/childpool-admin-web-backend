const UpdateAffiliateSchedule = require("./update-affiliate.schedule");
const CheckDistributeRewardSchedule = require("./check-distribute-reward.schedule");
const CheckAdaPoolSizeSchedule = require("./check-ada-pool-size.schedule")
const CheckExchangeStatusSchedule = require("./check-exchange-status.schedule")
const GetMemberAssetSchedule = require("./get-member-asset.schedule");
const SyncCurrencyWithChangelly = require("./sycn-currency-with-changelly.schedule");

module.exports = {
  start: () => {
    // UpdateAffiliateSchedule.run();
    // CheckAdaPoolSizeSchedule.run();
    // CheckExchangeStatusSchedule.run();
    GetMemberAssetSchedule.run();
    // SyncCurrencyWithChangelly.run();
  }
};
