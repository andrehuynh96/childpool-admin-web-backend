'use strict';
const localizeObj = require('./localize-state.json');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_kyc_properties')
          .then(async (tableDefinition) => {
            const listStateJapanese = Object.keys(localizeObj.jp);
            const listStateEnglish = Object.keys(localizeObj.en);
            const keys = Object.values(localizeObj.en);
            for (let item of listStateJapanese) {
              const updateJapaneseToLocalizeKey = `UPDATE member_kyc_properties SET value = '${localizeObj.jp[item]}' WHERE value iLike '${item}'`;
              await queryInterface.sequelize.query(updateJapaneseToLocalizeKey, {}, {});
            }

            for (let item of listStateEnglish) {
              const updateEnglishToLocalizeKey = `UPDATE member_kyc_properties SET value = '${localizeObj.en[item]}' WHERE value iLike '${item}'`;
              await queryInterface.sequelize.query(updateEnglishToLocalizeKey, {}, {});
            }
            const notInListStr = `('${keys.join("','")}')`;
            const removeStateTextSQL = `UPDATE member_kyc_properties
              SET value=''
              WHERE member_kyc_id IN (SELECT member_kyc_id FROM member_kyc_properties WHERE field_key='country'
              AND value='JP') AND field_key='city' AND value NOT IN ${notInListStr} `;
            await queryInterface.sequelize.query(removeStateTextSQL, {}, {});
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
