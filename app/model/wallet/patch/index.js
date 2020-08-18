const config = require("app/config");
const updateMembershipRewards = require('./update-membership-rewards');

module.exports = async () => {
  try {
    await updateMembershipRewards();
  }
  catch (err) {
    console.log(err);
  }
};
