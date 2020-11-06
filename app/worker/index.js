const UpdateAffiliateSchedule = require("./update-affiliate.schedule");
const CheckDistributeRewardSchedule = require("./check-distribute-reward.schedule");
const CheckAdaPoolSizeSchedule = require("./check-ada-pool-size.schedule")
const CheckExchangeStatusSchedule = require("./check-exchange-status.schedule")
const GetMemberAssetSchedule = require("./get-member-asset.schedule");
const SyncCurrencyWithChangelly = require("./sycn-currency-with-changelly.schedule");
const CheckStatusFiatTransactionSchedule = require("./check-status-fiat-transaction.schedule");
const fs = require('fs');

module.exports = {
  start: async () => {
    await _removeLockFile();
    UpdateAffiliateSchedule.run();
    CheckAdaPoolSizeSchedule.run();
    CheckExchangeStatusSchedule.run();
    GetMemberAssetSchedule.run();
    SyncCurrencyWithChangelly.run();
    CheckStatusFiatTransactionSchedule.run();
  }
};

async function _removeLockFile() {
  try {
    let files = [
      UpdateAffiliateSchedule.lockFile(),
      CheckAdaPoolSizeSchedule.lockFile(),
      CheckExchangeStatusSchedule.lockFile(),
      GetMemberAssetSchedule.lockFile(),
      SyncCurrencyWithChangelly.lockFile(),
      CheckStatusFiatTransactionSchedule.lockFile()
    ];
    for (let f of files) {
      if (f) {
        await _remove(f);
      }
    }
  }
  catch (err) {
    console.log('_removeLockFile Error:::', err)
  }
}

async function _remove(f) {
  return new Promise((resolve, reject) => {
    fs.unlink(f, function (err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(`Deleted ${f}.`);
      }
      resolve(true);
    });
  })
}
