const { forEachSeries } = require('p-iteration');
const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const database = require('app/lib/database').db().wallet;
const MembershipType = require("app/model/wallet").membership_types;
const Sequelize = require('sequelize');
const { membershipApi } = require('app/lib/affiliate-api');
const config = require('app/config');

const Op = Sequelize.Op;

module.exports = async () => {
  if (!config.patchData.isEnabledDowngrageGoldMembers) {
    return;
  }

  logger.info('DOWNGRADE GOLD MEMBER STARTS');
  const goldMembershipType = await MembershipType.findOne({
    where: {
      name: 'Gold',
    }
  });

  if (!goldMembershipType) {
    logger.info(`Not found Gold membership type`);
    return;
  }

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
      membership_type_id: goldMembershipType.id,
      kyc_level: "LEVEL_1",
      referrer_code: null,
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

      await Member.update({
        membership_type_id: silverMembershipType.id
      },
        {
          where: {
            id: member.id,
          },
          transaction: transaction
        });


      await transaction.commit();
    } catch (error) {
      logger.error(error);
      if (transaction) {
        await transaction.rollback();
      }
    }
  });

  logger.info('DOWNGRADE GOLD MEMBER END.');
};
