const { map, forEachSeries } = require('p-iteration');
const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const database = require('app/lib/database').db().wallet;
const MembershipOrder = require("app/model/wallet").membership_orders;
const MembershipType = require("app/model/wallet").membership_types;
const MemberRewardTransactionHistory = require("app/model/wallet").member_reward_transaction_his;
const MemberRewardAction = require("app/model/wallet/value-object/member-reward-transaction-action");
const SystemType = require('app/model/wallet/value-object/system-type');
const MembershipOrderStatus = require("app/model/wallet/value-object/membership-order-status");
const MemberRewardCommissionMethod = require("app/model/wallet/value-object/member-reward-transaction-commission-method");
const Sequelize = require('sequelize');
const { membershipApi } = require('app/lib/affiliate-api');
const config = require('app/config');

const Op = Sequelize.Op;

module.exports = async () => {
  if (!config.patchData.patchIsEnabledSyncMembershipType) {
    return;
  }

  logger.info('UPDATING MEMBERSHIP TYPE STARTS');
  const silverMembershipType = await MembershipType.findOne({
    where: {
      name: 'Silver',
    }
  });

  if (!silverMembershipType) {
    logger.info(`Not found Silver membership type`);
    return;
  }

  const members = await Member.findAll({
    where: {
      membership_type_id: silverMembershipType.id
    },
    order: [['created_at', 'ASC']]
  });

  await forEachSeries(members, async member => {
    logger.info(`Syncing data for member: ${member.email}.`);

    let transaction = await database.transaction();
    try {
      let result = await membershipApi.updateMembershipType(member, silverMembershipType);

      if (result.httpCode !== 200) {
        await transaction.rollback();
        return;
      }

      await transaction.commit();
    } catch (error) {
      logger.error(error);
      if (transaction) {
        await transaction.rollback();
      }
    }
  });

  logger.info('UPDATING MEMBERSHIP REWARDS END.');
};
