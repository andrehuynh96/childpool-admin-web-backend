const updateMembershipRewards = require('./update-membership-rewards');
const syncMembershipType = require('./sync-membership-type');
const syncClients = require('./sync-clients');
const downgradeGoldMembers = require('./downgrade-gold-members');

module.exports = async () => {
  try {
    await downgradeGoldMembers();
    await syncMembershipType();
    await updateMembershipRewards();
    await syncClients();
  }
  catch (err) {
    console.log(err);
  }
};
