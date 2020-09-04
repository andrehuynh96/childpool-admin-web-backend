'use strict';

const KYC_PROPERTIES = [
  {
    "field_name": "Email",
    "field_key": "email",
    "description": "Your Email",
    "data_type": "EMAIL",
    "member_field": "email",
    "require_flg": true,
    "order_index": 0,
    "enabled_flg": true,
    "max_length": 100,
  },
  {
    "field_name": "Account Type",
    "field_key": "account_type",
    "description": "Your Account Type",
    "data_type": "TEXT",
    "member_field": "",
    "require_flg": false,
    "check_data_type_flg": false,
    "order_index": 2,
    "enabled_flg": true,
    "max_length": null
  },
  {
    "field_name": "First Name",
    "field_key": "first_name",
    "description": "Your First Name",
    "data_type": "TEXT",
    "member_field": "first_name",
    "require_flg": true,
    "check_data_type_flg": false,
    "order_index": 2,
    "enabled_flg": true,
    "max_length": 100,
  },
  {
    "field_name": "Last Name",
    "field_key": "last_name",
    "description": "Your Last Name",
    "data_type": "TEXT",
    "member_field": "last_name",
    "require_flg": true,
    "check_data_type_flg": false,
    "order_index": 1,
    "enabled_flg": true,
    "max_length": 100,
  },
  {
    "field_name": "Last Name Kanji",
    "field_key": "last_name_kanji",
    "description": "Your Last Name Kanji",
    "data_type": "TEXT",
    "member_field": "last_name_kanji",
    "require_flg": false,
    "check_data_type_flg": false,
    "order_index": 3,
    "enabled_flg": true,
    "max_length": 100,
  },
  {
    "field_name": "First Name Kanji",
    "field_key": "first_name_kanji",
    "description": "Your First Name Kanji",
    "data_type": "TEXT",
    "member_field": "first_name_kanji",
    "require_flg": false,
    "check_data_type_flg": false,
    "order_index": 4,
    "enabled_flg": true,
    "max_length": 100,
  },
  {
    "field_name": "Address",
    "field_key": "address",
    "description": "Your Address",
    "data_type": "TEXT",
    "member_field": "address",
    "require_flg": true,
    "check_data_type_flg": false,
    "order_index": 1,
    "enabled_flg": true,
    "max_length": null
  },
  {
    "field_name": "Country Phone Code",
    "field_key": "country_phone_code",
    "description": "Your Country Phone Code",
    "data_type": "TEXT",
    "member_field": "country_phone_code",
    "require_flg": true,
    "check_data_type_flg": false,
    "order_index": 2,
    "enabled_flg": true,
    "max_length": 64
  },
  {
    "field_name": "Corporation Name",
    "field_key": "corporation_name",
    "description": "Your Corporation Name",
    "data_type": "TEXT",
    "member_field": "",
    "require_flg": false,
    "check_data_type_flg": false,
    "order_index": 5,
    "enabled_flg": true,
    "max_length": 500,
  },
  {
    "field_name": "City",
    "field_key": "city",
    "description": "Your City",
    "data_type": "TEXT",
    "member_field": "city",
    "require_flg": true,
    "check_data_type_flg": false,
    "order_index": 10,
    "enabled_flg": true,
    "group_name": "Country & City of residence",
    "max_length": 64
  },
  {
    "field_name": "Country",
    "field_key": "country",
    "description": "Your Country",
    "data_type": "TEXT",
    "member_field": "country",
    "require_flg": true,
    "check_data_type_flg": false,
    "order_index": 9,
    "enabled_flg": true,
    "group_name": "Country & City of residence",
    "max_length": 64
  },
  {
    "field_name": "Date of birth",
    "field_key": "date_of_birth",
    "description": "Your BOD",
    "data_type": "DATETIME",
    "member_field": "date_of_birth",
    "require_flg": true,
    "check_data_type_flg": false,
    "order_index": 6,
    "enabled_flg": true,
    "max_length": null
  },
  {
    "field_name": "Company Name",
    "field_key": "company_name",
    "description": "Your Company Name",
    "data_type": "TEXT",
    "member_field": "",
    "require_flg": false,
    "check_data_type_flg": false,
    "order_index": 7,
    "enabled_flg": true,
    "max_length": 500,
  },
  {
    "field_name": "Phone",
    "field_key": "phone",
    "description": "Your Phone",
    "data_type": "TEXT",
    "member_field": "phone",
    "require_flg": true,
    "check_data_type_flg": false,
    "order_index": 3,
    "enabled_flg": true,
    "max_length": 32
  },

  {
    "field_name": "Identity ID",
    "field_key": "identity_id",
    "description": "Your Identity Id",
    "data_type": "TEXT",
    "member_field": null,
    "require_flg": false,
    "check_data_type_flg": false,
    "order_index": 4,
    "enabled_flg": true,
    "max_length": 100,
  },
  {
    "field_name": "Address",
    "field_key": "address",
    "description": "Your Address",
    "data_type": "TEXT",
    "member_field": "address",
    "require_flg": true,
    "check_data_type_flg": false,
    "order_index": 1,
    "enabled_flg": true,
    "max_length": 256,
  },
];


module.exports = {
  up: (queryInterface, Sequelize) => {
    // eslint-disable-next-line no-unused-vars
    return queryInterface.sequelize.transaction(async t => {
      for (const kycProperty of KYC_PROPERTIES) {
        const sql = `
        UPDATE kyc_properties SET
          order_index=${kycProperty.order_index || 0},
          max_length=${kycProperty.max_length ? kycProperty.max_length : 'NULL'}
        WHERE field_key = '${kycProperty.field_key}';
        `;
        await queryInterface.sequelize.query(sql, {}, {});
      }

      return Promise.resolve();
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return Promise.resolve();
  }
};
