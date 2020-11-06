'use strict';

const getMembershipTypeId = (allMembershipTypes, name) => {
  const membeshipType = allMembershipTypes.find(item => item.name === name);

  return membeshipType ? membeshipType.id : null;
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    // eslint-disable-next-line no-unused-vars
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('membership_types')
          .then(async (tableDefinition) => {
            const updatePlatinumSQL = `UPDATE membership_types SET (price,is_enabled) = (100,true) WHERE name= 'Platinum'`;
            await queryInterface.sequelize.query(updatePlatinumSQL, {}, {});

            const updateGoldSQL = `UPDATE membership_types Set price= 0 Where name= 'Gold'`;
            await queryInterface.sequelize.query(updateGoldSQL, {}, {});

            const getAllMembershipTypesSql = `SELECT * FROM membership_types`;
            const [allMembershipTypes] = await queryInterface.sequelize.query(getAllMembershipTypesSql, {}, {});
            const platinumMembeshipTypeId = getMembershipTypeId(allMembershipTypes, 'Platinum');
            const silverMembeshipTypeId = getMembershipTypeId(allMembershipTypes, 'Silver');
            const goldMembeshipTypeId = getMembershipTypeId(allMembershipTypes, 'Gold');
            if (!silverMembeshipTypeId || !goldMembeshipTypeId || !platinumMembeshipTypeId) {
              throw new Error('Missing membership type');
            }

            const updateMembershipOrderSQL = `UPDATE membership_orders SET membership_type_id = '${platinumMembeshipTypeId}' WHERE status = 'Pending';`;
            await queryInterface.sequelize.query(updateMembershipOrderSQL, {}, {});

            const updateGoldToPlatinumMemberSQL = `
            UPDATE members SET membership_type_id = '${platinumMembeshipTypeId}'
            WHERE membership_type_id = '${goldMembeshipTypeId}' AND membership_type_id_bk = '${goldMembeshipTypeId}'
            `;
            await queryInterface.sequelize.query(updateGoldToPlatinumMemberSQL, {}, {});

            const updateSilverToGoldMemberSQL = `
            UPDATE members SET membership_type_id = '${goldMembeshipTypeId}'
            WHERE membership_type_id = '${silverMembeshipTypeId}' AND membership_type_id_bk = '${silverMembeshipTypeId}'
                AND kyc_level = 'LEVEL_2' AND kyc_status = 'Approved'
            `;
            await queryInterface.sequelize.query(updateSilverToGoldMemberSQL, {}, {});

            return Promise.resolve();
          })
      ]);
    } );
  },
  down: (queryInterface, Sequelize) => {
    return Promise.resolve();
  }
};
