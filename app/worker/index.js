const UpdateAffiliateSchedule = require("./update-affiliate.schedule");
const CheckDistributeRewardSchedule = require("./check-distribute-reward.schedule");
const CheckAdaPoolSizeSchedule = require("./check-ada-pool-size.schedule")
const CheckExchangeStatusSchedule = require("./check-exchange-status.schedule")

module.exports = {
  start: () => {
    // UpdateAffiliateSchedule.run();
    // CheckDistributeRewardSchedule.run();
    CheckAdaPoolSizeSchedule.run();
    CheckExchangeStatusSchedule.run();
  }
};
