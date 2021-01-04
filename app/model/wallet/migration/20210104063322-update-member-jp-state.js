'use strict';
const localizeObj = require('./localize-state.json');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('members')
          .then(async (tableDefinition) => {
            const listStateJapanese = Object.keys(localizeObj.jp);
            const listStateEnglish = Object.keys(localizeObj.en);
            for (let item of listStateJapanese) {
              const updateJapaneseToLocalizeKey = `UPDATE members SET city = '${localizeObj.jp[item]}' WHERE city iLike '${item}'`;
              await queryInterface.sequelize.query(updateJapaneseToLocalizeKey, {}, {});
            }

            for (let item of listStateEnglish) {
              const updateEnglishToLocalizeKey = `UPDATE members SET city = '${localizeObj.en[item]}' WHERE city iLike '${item}'`;
              await queryInterface.sequelize.query(updateEnglishToLocalizeKey, {}, {});
            }
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
