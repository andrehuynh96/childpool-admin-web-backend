const updateMembershipRewards = require('./update-membership-rewards');
const syncMembershipType = require('./sync-membership-type');
const syncClients = require('./sync-clients');

module.exports = async () => {
  try {
    await syncMembershipType();
    await updateMembershipRewards();
    await syncClients();
  }
  catch (err) {
    console.log(err);
  }
};
