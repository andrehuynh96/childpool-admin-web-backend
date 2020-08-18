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
  if (!config.patchData.isEnabledUpdatingMembershipRewards) {
    return;
  }

  logger.info('UPDATING MEMBERSHIP REWARDS STARTS');
  const orders = await MembershipOrder.findAll({
    where: {
      status: MembershipOrderStatus.Approved,
      recalculate_reward: {
        [Op.not]: true,
      },
    },
    include: {
      attributes: ['email', 'first_name', 'last_name', 'current_language'],
      as: "Member",
      model: Member,
      required: true
    },
    order: [['created_at', 'ASC']]
  });
  // id: 142

  await forEachSeries(orders, async order => {
    const numOfRewards = await MemberRewardTransactionHistory.count({
      where: {
        membership_order_id: order.id,
      },
    });

    if (numOfRewards > 0) {
      return MembershipOrder.update(
        {
          recalculate_reward: true,
        },
        {
          where: {
            id: order.id,
          },
        });
    }

    logger.info(`OrderId: ${order.id}. Member's email: ${ order.Member.email}.`);
    let transaction;
    try {
      const membershipType = await MembershipType.findOne({
        where: {
          id: order.membership_type_id
        }
      });
      if (!membershipType) {
        return;
      }

      transaction = await database.transaction();
      // Save reward transaction histories
      const result = await membershipApi.registerMembership({
        email: order.Member.email,
        referrerCode: order.referrer_code,
        membershipOrder: order,
        membershipType,
      });
      if (result.httpCode != 200) {
        console.log(result.data);
        await transaction.rollback();
        return;
      }

      let memberRewardTransactionHistories = await map(result.data.rewards || [], async (item) => {
        const member = await _findMemberByEmail(item.ext_client_id);
        if (!member) {
          return;
        }

        const introducedByEmail = item.introduced_by_ext_client_id;

        return {
          member_id: member.id,
          currency_symbol: item.currency_symbol,
          amount: item.amount,
          commission_method: item.commisson_type.toUpperCase() === 'DIRECT' ? MemberRewardCommissionMethod.DIRECT : MemberRewardCommissionMethod.INDIRECT,
          system_type: SystemType.MEMBERSHIP,
          action: MemberRewardAction.REWARD_COMMISSION,
          commission_from: null,
          note: introducedByEmail,
          membership_order_id: order.id,
        };
      });
      memberRewardTransactionHistories = memberRewardTransactionHistories.filter(item => !!item);
      await MemberRewardTransactionHistory.bulkCreate(memberRewardTransactionHistories, { transaction });

      await MembershipOrder.update(
        {
          recalculate_reward: true,
        },
        {
          where: {
            id: order.id,
          },
          transaction: transaction
        });

      // await transaction.commit();
      await transaction.rollback();

    } catch (error) {
      logger.log(error);
      if (transaction) {
        await transaction.rollback();
      }
    }
  });

  logger.info('UPDATING MEMBERSHIP REWARDS END.');
};

async function _findMemberByEmail(email) {
  let member = await Member.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  return member;
}
