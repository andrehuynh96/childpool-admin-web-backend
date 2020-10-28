'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('members')
          .then(async (tableDefinition) => {
            const updateSQL = `UPDATE members
            SET (membership_type_id,membership_type_id_bk)=((SELECT id FROM membership_types WHERE name='Gold'),(SELECT id FROM membership_types WHERE name='Silver'))
            WHERE membership_type_id=(SELECT id FROM membership_types WHERE name='Gold')
                AND kyc_id='2'`;
            await queryInterface.sequelize.query(updateSQL, {}, {});
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
