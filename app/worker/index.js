const UpdateAffiliateSchedule = require("./update-affiliate.schedule");

module.exports = {
  start: () => {
    UpdateAffiliateSchedule.run();
  }
}
