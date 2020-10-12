'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // eslint-disable-next-line no-unused-vars
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('membership_types')
          .then(async (tableDefinition) => {
            const updatePlatinumSQL = `UPDATE membership_types SET (price,is_enabled) = (100,true) WHERE name= 'Platinum'`;
            await queryInterface.sequelize.query(updatePlatinumSQL, {}, {});

            const updateGoldSQL =  `UPDATE membership_types Set price= 0 Where name= 'Gold'`;
            await queryInterface.sequelize.query(updateGoldSQL, {}, {});

            const updateMembershipOrderSQL = `UPDATE membership_orders SET membership_type_id = (SELECT id FROM membership_types WHERE name = 'Platinum') WHERE status = 'Pending' `;
            await queryInterface.sequelize.query(updateMembershipOrderSQL, {}, {});

            const updateGoldMemberSQL = `UPDATE members SET membership_type_id = (SELECT id FROM membership_types WHERE name = 'Platinum') WHERE membership_type_id = (SELECT id FROM membership_types WHERE name = 'Gold')`;
            await queryInterface.sequelize.query(updateGoldMemberSQL, {}, {});

            const updateSilverMemberSQL = `UPDATE members SET membership_type_id = (SELECT id FROM membership_types WHERE name = 'Gold') WHERE membership_type_id = (SELECT id FROM membership_types WHERE name = 'Silver') AND kyc_id = '3' AND kyc_level = 'LEVEL_2' AND kyc_status = 'Approved' AND referrer_code IS NOT NULL`;
            await queryInterface.sequelize.query(updateSilverMemberSQL, {}, {});

            return Promise.resolve();
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
