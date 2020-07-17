const UpdateAffiliateSchedule = require("./update-affiliate.schedule");
const CheckDistributeRewardSchedule = require("./check-distribute-reward.schedule");

module.exports = {
  start: () => {
    UpdateAffiliateSchedule.run();
    // CheckDistributeRewardSchedule.run();
  }
}
