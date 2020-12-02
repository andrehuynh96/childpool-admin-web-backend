'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('kyc_properties')
          .then(async (tableDefinition) => {
            const updateRequireSQL = `UPDATE kyc_properties SET require_flg=true
            WHERE field_key in ('last_name_kanji','first_name_kanji','account_type')`;
            await queryInterface.sequelize.query(updateRequireSQL, {}, {});

            const updateOptionalSQL = `UPDATE kyc_properties SET require_flg=false
            WHERE field_key = 'country_phone_code'`;
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
