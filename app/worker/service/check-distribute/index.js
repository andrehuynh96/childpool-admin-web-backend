const MemberDistributeRewardStatus = require("app/model/wallet/value-object/member-distribute-reward-status");
const MemberDistributeReward = require("app/model/wallet").member_distribute_reward_his;
const Service = require('./base');

class CheckTransactionDistributeReward {
  constructor() {
  }

  async check() {
    let transactions = await MemberDistributeRewardStatus.findAll({
      where: {
        status: TransactionStatus.PENDING
      }
    });

    if (transactions && transactions.length > 0) {
      for (let e of transactions) {
        let s = new Service(e);
        if (s) {
          s.check();
        }
      }
    }
  }

}
module.exports = CheckTransactionDistributeReward;