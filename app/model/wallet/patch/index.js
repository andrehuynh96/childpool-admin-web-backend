const updateMembershipRewards = require('./update-membership-rewards');
const syncMembershipType = require('./sync-membership-type');

module.exports = async () => {
  try {
    await syncMembershipType();
    await updateMembershipRewards();
  }
  catch (err) {
    console.log(err);
  }
};
