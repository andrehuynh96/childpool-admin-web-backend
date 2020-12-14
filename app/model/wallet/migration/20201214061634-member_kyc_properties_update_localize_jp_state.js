'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_kyc_properties')
          .then(async (tableDefinition) => {
            const localizeKey = 'PROVINCE_LIST_JAPAN_';
            const updateOptionalSQL = `UPDATE member_kyc_properties
              SET value=CONCAT('${localizeKey}',UPPER(value))
              WHERE member_kyc_id IN (SELECT member_kyc_id FROM member_kyc_properties WHERE field_key='country'
              AND value='JP') AND field_key='city' `;
            await queryInterface.sequelize.query(updateOptionalSQL, {}, {});
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
