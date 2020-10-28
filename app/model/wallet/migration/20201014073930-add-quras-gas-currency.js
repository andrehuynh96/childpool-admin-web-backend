/* eslint-disable no-unused-vars */
'use strict';
const _ = require('lodash');
const items = require('./explorer-data.json');
const moment = require('moment');
const getValueOrNull = (text) => {
  if (text === null) {
    return 'NULL';
  }

  return `'${text}'`;
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('currencies')
          .then(async (tableDefinition) => {
            const quras = items.find(item => item.currencySymbol === "XQC");
            const today = new Date();
            const created_at = moment(today).utc();
            const insertSQL = `INSERT INTO currencies(symbol,name,icon,decimals,platform,type,order_index,status,created_by,updated_by,created_at,updated_at,default_flg,explore_url,transaction_format_link,address_format_link,network,web_site_url) VALUES('${quras.currencySymbol}','QURAS','https://static.chainservices.info/staking/platforms/xqc.png',${quras.decimals},'${quras.currencySymbol}','NATIVE',11,1,0,0,'${created_at}','${created_at}',false,'${quras.url}','${quras.transactionFormatLink}','${quras.addressFormatLink}','mainnet','${quras.web_site_url}'),('XQG','GAS',null,${quras.decimals},'${quras.currencySymbol}','NATIVE',11,1,0,0,'${created_at}','${created_at}',false,'${quras.url}','${quras.transactionFormatLink}','${quras.addressFormatLink}','mainnet','${quras.web_site_url}')`;

            await queryInterface.sequelize.query(insertSQL, {}, {});
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
