const Model = require("app/model/wallet").settings;

const SETTINGS = [
  {
    "key": "SEND_EMAIL",
    "value": "1",
    "type": "string",
    "property": "send_email"
  },
  {
    "key": "ADMIN_EMAIL_ADDRESS",
    "value": "myhn@blockchainlabs.asia",
    "type": "string",
    "property": "admin_email_address"
  },
  {
    "key": "ENABLE_FREE_MEMBERSHIP_FLG",
    "value": "true",
    "type": "string",
    "property": "enable_free_membership_flg"
  },
  {
    "key": "NUM_OF_MEMBERSHIPS",
    "value": "1",
    "type": "number",
    "property": "num_of_memberships"
  },
  {
    "key": "UPGRADE_PAID_MEMBER_FLG",
    "value": "true",
    "type": "boolean",
    "property": "upgrade_paid_member_flg"
  },
  {
    "key": "ALLOW_UPGRADE_FLG",
    "value": "true",
    "type": "boolean",
    "property": "allow_upgrade_flg"
  },
  {
    "key": "NUM_OF_PAID_MEMBERS",
    "value": "5",
    "type": "number",
    "property": "num_of_paid_members"
  },
  {
    "key": "NUM_OF_FREE_MEMBERS",
    "value": "5",
    "type": "number",
    "property": "num_of_free_members"
  },
  {
    "key": "STAKING_AMOUNT",
    "value": "5",
    "type": "number",
    "property": "staking_amount"
  },
  {
    "key": "STAKING_AMOUNT_CURRENCY_SYMBOL",
    "value": "USD",
    "type": "string",
    "property": "staking_amount_currency_symbol"
  },
  {
    "key": "STAKING_REWARD",
    "value": "5",
    "type": "number",
    "property": "staking_reward"
  },
  {
    "key": "STAKING_REWARD_CURRENCY_SYMBOL",
    "value": "USD",
    "type": "string",
    "property": "staking_reward_currency_symbol"
  },
  {
    "key": "MEMBERSHIP_TYPE_FREE_MEMBERSHIP_FLG",
    "value": "true",
    "type": "boolean",
    "property": "membership_type_free_membership_flg"
  },
  {
    "key": "MEMBERSHIP_TYPE_UPGRADE_PAID_MEMBER_FLG",
    "value": "false",
    "type": "boolean",
    "property": "membership_type_upgrade_paid_member_flg"
  },
  {
    "key": "UPGRADE_TO_MEMBERSHIP_TYPE_ID",
    "value": "",
    "type": "string",
    "property": "upgrade_to_membership_type_id"
  },
  {
    "key": "USD_RATE_BY_JPY",
    "value": "107.483",
    "type": "number",
    "property": "usd_rate_by_jpy"
  },
  {
    "key": "USD_RATE_BY_JPY_UPDATED_AT",
    "value": "",
    "type": "string",
    "property": "usd_rate_by_jpy_updated_at"
  },
  {
    "key": "MEMBERSHIP_COMMISSION_USDT_MINIMUM_CLAIM_AMOUNT",
    "value": "50",
    "type": "number",
    "property": "membership_commission_usdt_minimum_claim_amount"
  },
  {
    "key": "USD_RATE_BY_USD",
    "value": "1",
    "type": "number",
    "property": "usd_rate_by_usd"
  },
  {
    "key": "CLAIM_AFFILIATE_REWARD_ATOM",
    "value": "0.5",
    "type": "number",
    "property": "claim_affiliate_reward_atom"
  },
  {
    "key": "CLAIM_AFFILIATE_REWARD_IRIS",
    "value": "0.5",
    "type": "number",
    "property": "claim_affiliate_reward_iris"
  },
  {
    "key": "CLAIM_AFFILIATE_REWARD_ONG",
    "value": "0.5",
    "type": "number",
    "property": "claim_affiliate_reward_ong"
  },
  {
    "key": "CLAIM_AFFILIATE_REWARD_XTZ",
    "value": "0.5",
    "type": "number",
    "property": "minimun_claim_amount_xtz"
  },
  {
    "key": "CLAIM_AFFILIATE_REWARD_ONE",
    "value": "0.5",
    "type": "number",
    "property": "minimun_claim_amount_one"
  },
  {
    "key": "CLAIM_AFFILIATE_REWARD_ATOM_NETWORK_FEE",
    "value": "0",
    "type": "number",
    "property": "claim_atom_network_fee"
  },
  {
    "key": "CLAIM_AFFILIATE_REWARD_IRIS_NETWORK_FEE",
    "value": "0",
    "type": "number",
    "property": "claim_iris_network_fee"
  },
  {
    "key": "CLAIM_AFFILIATE_REWARD_ONG_NETWORK_FEE",
    "value": "0",
    "type": "number",
    "property": "claim_ong_network_fee"
  },
  {
    "key": "CLAIM_AFFILIATE_REWARD_XTZ_NETWORK_FEE",
    "value": "0",
    "type": "number",
    "property": "claim_xtz_network_fee"
  },
  {
    "key": "CLAIM_AFFILIATE_REWARD_ONE_NETWORK_FEE",
    "value": "0",
    "type": "number",
    "property": "claim_one_network_fee"
  },
  {
    "key": "MEMBERSHIP_COMMISSION_USDT_NETWORK_FEE",
    "value": "0",
    "type": "number",
    "property": "membership_commission_usdt_network_fee"
  },
  {
    "key": "MS_POINT_CLAIM_POINTS",
    "value": "1",
    "type": "number",
    "property": "ms_point_claim_points"
  },
  {
    "key": "MS_POINT_DELAY_TIME_IN_SECONDS",
    "value": "86400",
    "type": "number",
    "property": "ms_point_delay_time_in_seconds"
  },
];

module.exports = async () => {
  const models = [];

  for (let item of SETTINGS) {
    let setting = await Model.findOne({
      where: {
        key: item.key,
      }
    });

    if (!setting) {
      setting = {
        key: item.key,
        value: item.value,
        type: item.type,
        property: item.property,
        created_by: 0,
        updated_by: 0,
      };

      models.push(setting);
    }
  }

  await Model.bulkCreate(
    models,
    {
      returning: true
    });

};
