const RoleName = require('./role-name');

// Please update new permission in this link https://docs.google.com/spreadsheets/d/1IJGzUpROXB8u3h4V6YGnf6BgtAGPqP97bHIf5hwkfqc/edit#gid=1745652268
module.exports = {
  "CHANGE_PASSWORD_ACCOUNT": {
    "KEY": "CHANGE_PASSWORD_ACCOUNT",
    "DESCRIPTION": "Change password",
    "GROUP_NAME": "Account",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2021-01-05T00:00:00.000Z"
  },
  "VIEW_LOGIN_HISTORY_ACCOUNT": {
    "KEY": "VIEW_LOGIN_HISTORY_ACCOUNT",
    "DESCRIPTION": "View list user's action history",
    "GROUP_NAME": "Account",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2021-01-05T00:00:00.000Z"
  },
  "VIEW_2FA_ACCOUNT": {
    "KEY": "VIEW_2FA_ACCOUNT",
    "DESCRIPTION": "Get 2fa secret in order to enable 2fa",
    "GROUP_NAME": "Account",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2021-01-05T00:00:00.000Z"
  },
  "UPDATE_2FA_ACCOUNT": {
    "KEY": "UPDATE_2FA_ACCOUNT",
    "DESCRIPTION": "Enable/Disable 2fa feature",
    "GROUP_NAME": "Account",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2021-01-05T00:00:00.000Z"
  },
  "UPDATE_PROFILE_ACCOUNT": {
    "KEY": "UPDATE_PROFILE_ACCOUNT",
    "DESCRIPTION": "Update account",
    "GROUP_NAME": "Account",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2021-01-05T00:00:00.000Z"
  },
  "VIEW_USER": {
    "KEY": "VIEW_USER",
    "DESCRIPTION": "View user information",
    "GROUP_NAME": "User",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
    ],
    "INITIALIZED_DATE": "2021-01-05T00:00:00.000Z"
  },
  "VIEW_LIST_USER": {
    "KEY": "VIEW_LIST_USER",
    "DESCRIPTION": "View List User",
    "GROUP_NAME": "User",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "VIEW_USER_DETAIL": {
    "KEY": "VIEW_USER_DETAIL",
    "DESCRIPTION": "View user detail",
    "GROUP_NAME": "User",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "CREATE_USER": {
    "KEY": "CREATE_USER",
    "DESCRIPTION": "Create user",
    "GROUP_NAME": "User",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "UPDATE_USER": {
    "KEY": "UPDATE_USER",
    "DESCRIPTION": "Update user",
    "GROUP_NAME": "User",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "DELETE_USER": {
    "KEY": "DELETE_USER",
    "DESCRIPTION": "Delete user",
    "GROUP_NAME": "User",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "ACTIVE_USER": {
    "KEY": "ACTIVE_USER",
    "DESCRIPTION": "Active user",
    "GROUP_NAME": "User",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "RESEND_EMAIL": {
    "KEY": "RESEND_EMAIL",
    "DESCRIPTION": "Resend email",
    "GROUP_NAME": "User",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },

  "VIEW_LIST_GRANDCHILD": {
    "KEY": "VIEW_LIST_GRANDCHILD",
    "DESCRIPTION": "View list grandchild",
    "GROUP_NAME": "Childpool",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "CREATE_GRANDCHILD": {
    "KEY": "CREATE_GRANDCHILD",
    "DESCRIPTION": "Create grandchild",
    "GROUP_NAME": "Childpool",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "UPDATE_GRANDCHILD": {
    "KEY": "UPDATE_GRANDCHILD",
    "DESCRIPTION": "Update grandchild",
    "GROUP_NAME": "Childpool",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "VIEW_LIST_KEY_PARTNER": {
    "KEY": "VIEW_LIST_KEY_PARTNER",
    "DESCRIPTION": "View list partner's key",
    "GROUP_NAME": "Partner",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "CREATE_KEY_PARTNER": {
    "KEY": "CREATE_KEY_PARTNER",
    "DESCRIPTION": "Create partner key",
    "GROUP_NAME": "Partner",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "VIEW_LIST_PARTNER_TX_MEMO": {
    "KEY": "VIEW_LIST_PARTNER_TX_MEMO",
    "DESCRIPTION": "View list partner's memo config",
    "GROUP_NAME": "Partner",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "CREATE_PARTNER_TX_MEMO": {
    "KEY": "CREATE_PARTNER_TX_MEMO",
    "DESCRIPTION": "Change partner's memo config",
    "GROUP_NAME": "Partner",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "VIEW_LIST_PARTNER_TX_MEMO_HISTORY": {
    "KEY": "VIEW_LIST_PARTNER_TX_MEMO_HISTORY",
    "DESCRIPTION": "View list partner's memo history config",
    "GROUP_NAME": "Partner",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "CREATE_COMMISSION_PARTNER": {
    "KEY": "CREATE_COMMISSION_PARTNER",
    "DESCRIPTION": "Change partner's commission config",
    "GROUP_NAME": "Partner",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "VIEW_LIST_COMMISSION_PARTNER": {
    "KEY": "VIEW_LIST_COMMISSION_PARTNER",
    "DESCRIPTION": "View list partner's memo config",
    "GROUP_NAME": "Partner",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "VIEW_HISTORY_COMMISSION_PARTNER": {
    "KEY": "VIEW_HISTORY_COMMISSION_PARTNER",
    "DESCRIPTION": "View list partner's commission history config",
    "GROUP_NAME": "Partner",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "REVOKE_KEY_PARTNER": {
    "KEY": "REVOKE_KEY_PARTNER",
    "DESCRIPTION": "Remove partner's key",
    "GROUP_NAME": "Partner",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },

  "CREATE_CHANGE_REWARD_ADDRESS_REQUEST": {
    "KEY": "CREATE_CHANGE_REWARD_ADDRESS_REQUEST",
    "DESCRIPTION": "Create change reward address request",
    "GROUP_NAME": "Settings",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "UPDATE_CHANGE_REWARD_ADDRESS_REQUEST": {
    "KEY": "UPDATE_CHANGE_REWARD_ADDRESS_REQUEST",
    "DESCRIPTION": "Update change reward address request",
    "GROUP_NAME": "Settings",
    "ROLES": [RoleName.Master],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },

  "MEMBERSHIP_VIEW_MEMBER_LIST": {
    "DESCRIPTION": "View membership member list",
    "GROUP_NAME": "Members",
    "KEY": "MEMBERSHIP_VIEW_MEMBER_LIST",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_VIEW_MEMBER_DETAIL": {
    "KEY": "MEMBERSHIP_VIEW_MEMBER_DETAIL",
    "DESCRIPTION": "View membership member detail",
    "GROUP_NAME": "Members",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_UPDATE_MEMBER": {
    "KEY": "MEMBERSHIP_UPDATE_MEMBER",
    "DESCRIPTION": "Update membership member",
    "GROUP_NAME": "Members",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_VIEW_REFERRAL_STRUCTURE": {
    "KEY": "MEMBERSHIP_VIEW_REFERRAL_STRUCTURE",
    "DESCRIPTION": "View membership member referral structure",
    "GROUP_NAME": "Members",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "REMOVE_2FA": {
    "KEY": "REMOVE_2FA",
    "DESCRIPTION": "Remove 2FA",
    "GROUP_NAME": "Members",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.KoreanOperator,
    ],

    "INITIALIZED_DATE": "2020-09-28T08:05:08.764Z"
  },
  "MEMBERSHIP_VIEW_MEMBER_KYC_LIST": {
    "KEY": "MEMBERSHIP_VIEW_MEMBER_KYC_LIST",
    "DESCRIPTION": "View membership member KYC list",
    "GROUP_NAME": "Members",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_UPDATE_MEMBER_KYC_PROPERTIES": {
    "KEY": "MEMBERSHIP_UPDATE_MEMBER_KYC_PROPERTIES",
    "DESCRIPTION": "Membership update member kyc properties",
    "GROUP_NAME": "Members",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_UPDATE_MEMBER_KYC_STATUS": {
    "KEY": "MEMBERSHIP_UPDATE_MEMBER_KYC_STATUS",
    "DESCRIPTION": "Membership update member kyc status",
    "GROUP_NAME": "Members",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },

  "MEMBERSHIP_EXPORT_CSV_MEMBERS": {
    "KEY": "MEMBERSHIP_EXPORT_CSV_MEMBERS",
    "DESCRIPTION": "Export members to CSV file",
    "GROUP_NAME": "Members",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },

  "MEMBERSHIP_VIEW_ORDER_LIST": {
    "KEY": "MEMBERSHIP_VIEW_ORDER_LIST",
    "DESCRIPTION": "View membership order list",
    "GROUP_NAME": "Membership Order",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_VIEW_ORDER_DETAIL": {
    "KEY": "MEMBERSHIP_VIEW_ORDER_DETAIL",
    "DESCRIPTION": "View membership order detail",
    "GROUP_NAME": "Membership Order",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_UPDATE_ORDER": {
    "KEY": "MEMBERSHIP_UPDATE_ORDER",
    "DESCRIPTION": "Update membership order",
    "GROUP_NAME": "Membership Order",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_EXPORT_CSV_ORDERS": {
    "KEY": "MEMBERSHIP_EXPORT_CSV_ORDERS",
    "DESCRIPTION": "Export membership orders to CSV file",
    "GROUP_NAME": "Membership Order",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
      RoleName.KoreanOperator,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },

  "MEMBERSHIP_VIEW_CLAIM_REQUEST_LIST": {
    "KEY": "MEMBERSHIP_VIEW_CLAIM_REQUEST_LIST",
    "DESCRIPTION": "View membership claim request list",
    "GROUP_NAME": "Claim request",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },

  "MEMBERSHIP_APPROVE_CLAIM_REQUEST": {
    "KEY": "MEMBERSHIP_APPROVE_CLAIM_REQUEST",
    "DESCRIPTION": "Approvet membership claim request",
    "GROUP_NAME": "Claim request",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_EXPORT_CSV_CLAIM_REQUESTS": {
    "KEY": "MEMBERSHIP_EXPORT_CSV_CLAIM_REQUESTS",
    "DESCRIPTION": "Export membership claim requests to CSV file",
    "GROUP_NAME": "Claim request",
    "ROLES": [
      RoleName.Master,
      RoleName.Admin,
      RoleName.Operator1,
      RoleName.Operator2,
    ],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_VIEW_CLAIM_REQUEST_DETAIL": {
    "KEY": "MEMBERSHIP_VIEW_CLAIM_REQUEST_DETAIL",
    "DESCRIPTION": "View membership claim request detail",
    "GROUP_NAME": "Claim request",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_UPDATE_CLAIM_REQUEST_TX_ID": {
    "KEY": "MEMBERSHIP_UPDATE_CLAIM_REQUEST_TX_ID",
    "DESCRIPTION": "Update transaction id of a membership claim request",
    "GROUP_NAME": "Claim request",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "AFFILIATE_TOKEN_PAYOUT_VIEW_LIST": {
    "KEY": "AFFILIATE_TOKEN_PAYOUT_VIEW_LIST",
    "DESCRIPTION": "View token payout list",
    "GROUP_NAME": "Token payout",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },

  "AFFILIATE_TOKEN_PAYOUT_APPROVE": {
    "KEY": "AFFILIATE_TOKEN_PAYOUT_APPROVE",
    "DESCRIPTION": "Approve membership token payout",
    "GROUP_NAME": "Token payout",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "AFFILIATE_TOKEN_PAYOUT_EXPORT_CSV": {
    "KEY": "AFFILIATE_TOKEN_PAYOUT_EXPORT_CSV",
    "DESCRIPTION": "Export token payout to CSV file",
    "GROUP_NAME": "Token payout",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "AFFILIATE_TOKEN_PAYOUT_VIEW_DETAIL": {
    "KEY": "AFFILIATE_TOKEN_PAYOUT_VIEW_DETAIL",
    "DESCRIPTION": "View token payout details",
    "GROUP_NAME": "Token payout",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "AFFILIATE_TOKEN_PAYOUT_UPDATE_TX_ID": {
    "KEY": "AFFILIATE_TOKEN_PAYOUT_UPDATE_TX_ID",
    "DESCRIPTION": "Update transaction id of a token payout",
    "GROUP_NAME": "Token payout",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },

  "VIEW_TOP_AFFILIATE": {
    "KEY": "VIEW_TOP_AFFILIATE",
    "DESCRIPTION": "View top affiliate",
    "GROUP_NAME": "Token payout",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-12-05T00:00:00.000Z"
  },

  "MEMBERSHIP_VIEW_MEMBERSHIP_TYPE": {
    "KEY": "MEMBERSHIP_VIEW_MEMBERSHIP_TYPE",
    "DESCRIPTION": "View membership type",
    "GROUP_NAME": "Membership Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_VIEW_UPGRADE_CONDITION": {
    "KEY": "MEMBERSHIP_VIEW_UPGRADE_CONDITION",
    "DESCRIPTION": "View membership upgrade condition",
    "GROUP_NAME": "Membership Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_VIEW_BANK_ACCOUNT_REWARD": {
    "KEY": "MEMBERSHIP_VIEW_BANK_ACCOUNT_REWARD",
    "DESCRIPTION": "View membership reward in case bank account",
    "GROUP_NAME": "Membership Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_UPDATE_BANK_ACCOUNT_REWARD": {
    "KEY": "MEMBERSHIP_UPDATE_BANK_ACCOUNT_REWARD",
    "DESCRIPTION": "Update membership reward in case bank account",
    "GROUP_NAME": "Membership Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_VIEW_RECEIVING_ADDRESS": {
    "KEY": "MEMBERSHIP_VIEW_RECEIVING_ADDRESS",
    "DESCRIPTION": "View membership receiving address",
    "GROUP_NAME": "Membership Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_VIEW_RECEIVING_ADDRESS_DETAIL": {
    "KEY": "MEMBERSHIP_VIEW_RECEIVING_ADDRESS_DETAIL",
    "DESCRIPTION": "View membership receiving address detail",
    "GROUP_NAME": "Membership Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_UPDATE_RECEIVING_ADDRESS": {
    "KEY": "MEMBERSHIP_UPDATE_RECEIVING_ADDRESS",
    "DESCRIPTION": "Update membership receiving address",
    "GROUP_NAME": "Membership Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_ADD_RECEIVING_ADDRESS": {
    "KEY": "MEMBERSHIP_ADD_RECEIVING_ADDRESS",
    "DESCRIPTION": "Add membership receiving address",
    "GROUP_NAME": "Membership Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_UPDATE_UPGRADE_CONDITION": {
    "KEY": "MEMBERSHIP_UPDATE_UPGRADE_CONDITION",
    "DESCRIPTION": "Get membership type upgrade condition",
    "GROUP_NAME": "Membership Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_VIEW_MEMBERSHIP_TYPE_CONFIG": {
    "KEY": "MEMBERSHIP_VIEW_MEMBERSHIP_TYPE_CONFIG",
    "DESCRIPTION": "View membership type config",
    "GROUP_NAME": "Membership Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_UPDATE_MEMBERSHIP_TYPE_CONFIG": {
    "KEY": "MEMBERSHIP_UPDATE_MEMBERSHIP_TYPE_CONFIG",
    "DESCRIPTION": "Update membership type config",
    "GROUP_NAME": "Membership Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_VIEW_MEMBERSHIP_POLICY_LIST": {
    "KEY": "MEMBERSHIP_VIEW_MEMBERSHIP_POLICY_LIST",
    "DESCRIPTION": "View membership policy list",
    "GROUP_NAME": "Membership Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_UPDATE_MEMBERSHIP_POLICY": {
    "KEY": "MEMBERSHIP_UPDATE_MEMBERSHIP_POLICY",
    "DESCRIPTION": "Update membership policy",
    "GROUP_NAME": "Membership Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },

  "MEMBERSHIP_VIEW_AFFILIATE_POLICY_LIST": {
    "KEY": "MEMBERSHIP_VIEW_AFFILIATE_POLICY_LIST",
    "DESCRIPTION": "View membership affiliate policy list",
    "GROUP_NAME": "Affiliate Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_VIEW_AFFILIATE_POLICY_DETAIL": {
    "KEY": "MEMBERSHIP_VIEW_AFFILIATE_POLICY_DETAIL",
    "DESCRIPTION": "View membership affiliate policy detail",
    "GROUP_NAME": "Affiliate Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_CREATE_AFFILIATE_POLICY": {
    "KEY": "MEMBERSHIP_CREATE_AFFILIATE_POLICY",
    "DESCRIPTION": "Create membership affiliate policy",
    "GROUP_NAME": "Affiliate Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_UPDATE_AFFILIATE_POLICY": {
    "KEY": "MEMBERSHIP_UPDATE_AFFILIATE_POLICY",
    "DESCRIPTION": "Update membership affiliate policy",
    "GROUP_NAME": "Affiliate Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_VIEW_CACULATOR_REWARD_REQUEST_LIST": {
    "KEY": "MEMBERSHIP_VIEW_CACULATOR_REWARD_REQUEST_LIST",
    "DESCRIPTION": "View membership calculator reward request list",
    "GROUP_NAME": "Affiliate Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_VIEW_CACULATOR_REWARD_REQUEST_DETAIL": {
    "KEY": "MEMBERSHIP_VIEW_CACULATOR_REWARD_REQUEST_DETAIL",
    "DESCRIPTION": "View membership calculator reward request detail",
    "GROUP_NAME": "Affiliate Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_VIEW_CACULATOR_REWARD_REQUEST_DETAIL_LIST": {
    "KEY": "MEMBERSHIP_VIEW_CACULATOR_REWARD_REQUEST_DETAIL_LIST",
    "DESCRIPTION": "View membership calculator reward request detail list",
    "GROUP_NAME": "Affiliate Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },

  "MEMBERSHIP_VIEW_MEMBERSHIP_AFFILIATE": {
    "KEY": "MEMBERSHIP_VIEW_MEMBERSHIP_AFFILIATE",
    "DESCRIPTION": "View membership affiliate",
    "GROUP_NAME": "Affiliate Configuration",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },

  "MEMBERSHIP_VIEW_CLAIM_MEMBERSHIP_REWARD_SETTING": {
    "KEY": "MEMBERSHIP_VIEW_CLAIM_MEMBERSHIP_REWARD_SETTING",
    "DESCRIPTION": "View claim membership reward setting",
    "GROUP_NAME": "Claim Membership Reward Setting",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_UPDATE_CLAIM_MEMBERSHIP_REWARD_SETTING": {
    "KEY": "MEMBERSHIP_UPDATE_CLAIM_MEMBERSHIP_REWARD_SETTING",
    "DESCRIPTION": "Update claim membership reward setting",
    "GROUP_NAME": "Claim Membership Reward Setting",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },

  "MEMBERSHIP_VIEW_FIAT_RATE": {
    "KEY": "MEMBERSHIP_VIEW_FIAT_RATE",
    "DESCRIPTION": "View fiat rate",
    "GROUP_NAME": "Fiat Rate",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "MEMBERSHIP_UPDATE_FIAT_RATE": {
    "KEY": "MEMBERSHIP_UPDATE_FIAT_RATE",
    "DESCRIPTION": "Update fiat rate",
    "GROUP_NAME": "Fiat Rate",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "AFFILIATE_VIEW_CLAIM_REWARD_SETTING": {
    "KEY": "AFFILIATE_VIEW_CLAIM_REWARD_SETTING",
    "DESCRIPTION": "View affiliate claim reward setting",
    "GROUP_NAME": "Claim Affiliate Reward Setting",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "AFFILIATE_UPDATE_CLAIM_REWARD_SETTING": {
    "KEY": "AFFILIATE_UPDATE_CLAIM_REWARD_SETTING",
    "DESCRIPTION": "Update affiliate claim reward setting",
    "GROUP_NAME": "Claim Affiliate Reward Setting",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },

  "VIEW_EMAIL_TEMPLATE_LIST": {
    "KEY": "VIEW_EMAIL_TEMPLATE_LIST",
    "DESCRIPTION": "View list email template",
    "GROUP_NAME": "Email Template",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "VIEW_EMAIL_TEMPLATE_DETAIL": {
    "KEY": "VIEW_EMAIL_TEMPLATE_DETAIL",
    "DESCRIPTION": "View email template detail",
    "GROUP_NAME": "Email Template",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "UPDATE_EMAIL_TEMPLATE": {
    "KEY": "UPDATE_EMAIL_TEMPLATE",
    "DESCRIPTION": "Update email template",
    "GROUP_NAME": "Email Template",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "CREATE_EMAIL_TEMPLATE": {
    "KEY": "CREATE_EMAIL_TEMPLATE",
    "DESCRIPTION": "Create email template",
    "GROUP_NAME": "Email Template",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "DELETE_EMAIL_TEMPLATE": {
    "KEY": "DELETE_EMAIL_TEMPLATE",
    "DESCRIPTION": "Delete email template",
    "GROUP_NAME": "Email Template",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "VIEW_LIST_CRYPTO_ADDRESS": {
    "KEY": "VIEW_LIST_CRYPTO_ADDRESS",
    "DESCRIPTION": "View list crypto address",
    "GROUP_NAME": "Crypto address",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "EXPORT_CRYPTO_ADDRESSES_CSV": {
    "KEY": "EXPORT_CRYPTO_ADDRESSES_CSV",
    "DESCRIPTION": "Download crypto address CSV",
    "GROUP_NAME": "Crypto address",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-23T00:00:00.000Z"
  },

  "VIEW_LIST_TERM": {
    "KEY": "VIEW_LIST_TERM",
    "DESCRIPTION": "View list term",
    "GROUP_NAME": "Term",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "VIEW_TERM_DETAIL": {
    "KEY": "VIEW_TERM_DETAIL",
    "DESCRIPTION": "View term detail",
    "GROUP_NAME": "Term",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "UPDATE_TERM": {
    "KEY": "UPDATE_TERM",
    "DESCRIPTION": "Update term",
    "GROUP_NAME": "Term",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "CREATE_TERM": {
    "KEY": "CREATE_TERM",
    "DESCRIPTION": "Create term",
    "GROUP_NAME": "Term",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "DELETE_TERM": {
    "KEY": "DELETE_TERM",
    "DESCRIPTION": "Delete term",
    "GROUP_NAME": "Term",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "VIEW_ADA_POOL_NOTIFY_CONFIG": {
    "KEY": "VIEW_ADA_POOL_NOTIFY_CONFIG",
    "DESCRIPTION": "View ADA pool notify config",
    "GROUP_NAME": "Notify to ADA stakeholder",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "UPDATE_ADA_POOL_NOTIFY_CONFIG": {
    "KEY": "UPDATE_ADA_POOL_NOTIFY_CONFIG",
    "DESCRIPTION": "Update ADA pool notify config",
    "GROUP_NAME": "Notify to ADA stakeholder",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-01T00:00:00.000Z"
  },
  "VIEW_LIST_MEMBER_ASSET": {
    "KEY": "VIEW_LIST_MEMBER_ASSET",
    "DESCRIPTION": "Search list member asset",
    "GROUP_NAME": "Member asset",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-04T02:50:08.764Z"
  },
  "EXPORT_MEMBER_ASSET_CSV": {
    "KEY": "EXPORT_MEMBER_ASSET_CSV",
    "DESCRIPTION": "Download member asset CSV",
    "GROUP_NAME": "Member asset",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-23T02:50:08.764Z"
  },

  // Exchange - Changelly
  "VIEW_EXCHANGE_CURRENCIES": {
    "KEY": "VIEW_EXCHANGE_CURRENCIES",
    "DESCRIPTION": "Search exchange currencies",
    "GROUP_NAME": "Exchange",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-08T00:00:00.000Z"
  },
  "CREATE_EXCHANGE_CURRENCY": {
    "KEY": "CREATE_EXCHANGE_CURRENCY",
    "DESCRIPTION": "Create exchange currency",
    "GROUP_NAME": "Exchange",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-08T00:00:00.000Z"
  },
  "UPDATE_EXCHANGE_CURRENCY": {
    "KEY": "UPDATE_EXCHANGE_CURRENCY",
    "DESCRIPTION": "Update exchange currency",
    "GROUP_NAME": "Exchange",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-08T00:00:00.000Z"
  },
  "RECEIVE_EMAIL_UPDATE_EXCHANGE": {
    "KEY": "RECEIVE_EMAIL_UPDATE_EXCHANGE",
    "DESCRIPTION": "Receive email update exchange",
    "GROUP_NAME": "Exchange",
    "ROLES": [RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-21T08:05:08.764Z"
  },

  "MEMBERSHIP_UPDATE_PAYOUT_TRANSFERRED": {
    "KEY": "MEMBERSHIP_UPDATE_PAYOUT_TRANSFERRED",
    "DESCRIPTION": "Update payout transferred commission payout",
    "GROUP_NAME": "Claim request",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-08T09:50:08.764Z"
  },
  "AFFILIATE_UPDATE_PAYOUT_TRANSFERRED": {
    "KEY": "AFFILIATE_UPDATE_PAYOUT_TRANSFERRED",
    "DESCRIPTION": "Update payout transferred token payout",
    "GROUP_NAME": "Token payout",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-08T09:50:08.764Z"
  },
  "VIEW_LIST_EXCHANGE_TRANSACTION": {
    "KEY": "VIEW_LIST_EXCHANGE_TRANSACTION",
    "DESCRIPTION": "Search exchange transaction",
    "GROUP_NAME": "Exchange Transaction",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-09T10:05:08.764Z"
  },
  "VIEW_EXCHANGE_TRANSACTION_DETAIL": {
    "KEY": "VIEW_EXCHANGE_TRANSACTION_DETAIL",
    "DESCRIPTION": "View exchange transaction detail",
    "GROUP_NAME": "Exchange Transaction",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-09T10:05:08.764Z"
  },
  "VIEW_LIST_CURRENCY": {
    "KEY": "VIEW_LIST_CURRENCY",
    "DESCRIPTION": "View list currency",
    "GROUP_NAME": "Currencies",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-21T08:05:08.764Z"
  },
  "VIEW_CURRENCY_DETAIL": {
    "KEY": "VIEW_CURRENCY_DETAIL",
    "DESCRIPTION": "View currency detail",
    "GROUP_NAME": "Currencies",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-21T08:05:08.764Z"
  },
  "UPDATE_CURRENCY_DETAIL": {
    "KEY": "UPDATE_CURRENCY_DETAIL",
    "DESCRIPTION": "Update currency",
    "GROUP_NAME": "Currencies",
    "ROLES": [RoleName.Master, RoleName.Admin],
    "INITIALIZED_DATE": "2020-09-21T08:05:08.764Z"
  },
  "VIEW_LIST_EMAIL_TRACKING": {
    "KEY": "VIEW_LIST_EMAIL_TRACKING",
    "DESCRIPTION": "View list email tracking",
    "GROUP_NAME": "Email Tracking",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-28T08:05:08.764Z"
  },
  "VIEW_EMAIL_TRACKING_DETAIL": {
    "KEY": "VIEW_EMAIL_TRACKING_DETAIL",
    "DESCRIPTION": "View email tracking detail",
    "GROUP_NAME": "Email Tracking",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-28T08:05:08.764Z"
  },

  // Notifications
  "VIEW_NOTIFICATIONS": {
    "KEY": "VIEW_NOTIFICATIONS",
    "DESCRIPTION": "Search notifications",
    "GROUP_NAME": "Notifications",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-28T00:00:00.000Z"
  },
  "CREATE_NOTIFICATION": {
    "KEY": "CREATE_NOTIFICATION",
    "DESCRIPTION": "Create a notification",
    "GROUP_NAME": "Notifications",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-28T00:00:00.000Z"
  },
  "UPDATE_NOTIFICATION": {
    "KEY": "UPDATE_NOTIFICATION",
    "DESCRIPTION": "Update a notification",
    "GROUP_NAME": "Notifications",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-28T00:00:00.000Z"
  },
  "DELETE_NOTIFICATION": {
    "KEY": "DELETE_NOTIFICATION",
    "DESCRIPTION": "Delete a notification",
    "GROUP_NAME": "Notifications",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-09-28T00:00:00.000Z"
  },

  // MS Point
  "VIEW_CLAIM_MS_POINT_HISTORIES": {
    "KEY": "VIEW_CLAIM_MS_POINT_HISTORIES",
    "DESCRIPTION": "View claim MS point histories",
    "GROUP_NAME": "MS Point",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-10-19T00:00:00.000Z"
  },
  "VIEW_MS_POINT_SETTINGS": {
    "KEY": "VIEW_MS_POINT_SETTINGS",
    "DESCRIPTION": "View MS point settings",
    "GROUP_NAME": "MS Point",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-10-29T00:00:00.000Z"
  },
  "UPDATE_MS_POINT_SETTINGS": {
    "KEY": "UPDATE_MS_POINT_SETTINGS",
    "DESCRIPTION": "Update MS point settings",
    "GROUP_NAME": "MS Point",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-10-29T00:00:00.000Z"
  },

  // Loggings
  "VIEW_LOGGINGS": {
    "KEY": "VIEW_LOGGINGS",
    "DESCRIPTION": "View loggings",
    "GROUP_NAME": "Logging",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-10-21T00:00:00.000Z"
  },
  "DELETE_LOGGING": {
    "KEY": "DELETE_LOGGING",
    "DESCRIPTION": "Delete a logging",
    "GROUP_NAME": "Logging",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-10-21T00:00:00.000Z"
  },

  // Questionnaire
  "SEARCH_QUESTIONS": {
    "KEY": "SEARCH_QUESTIONS",
    "DESCRIPTION": "Search questions",
    "GROUP_NAME": "Questionnaire",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-10-27T00:00:00.000Z"
  },
  "VIEW_QUESTION_DETAILS": {
    "KEY": "VIEW_QUESTION_DETAILS",
    "DESCRIPTION": "View question details",
    "GROUP_NAME": "Questionnaire",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-10-27T00:00:00.000Z"
  },
  "CREATE_QUESTION": {
    "KEY": "CREATE_QUESTION",
    "DESCRIPTION": "Create a question",
    "GROUP_NAME": "Questionnaire",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-10-27T00:00:00.000Z"
  },
  "UPDATE_QUESTION": {
    "KEY": "UPDATE_QUESTION",
    "DESCRIPTION": "Update a question",
    "GROUP_NAME": "Questionnaire",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-10-27T00:00:00.000Z"
  },
  "DELETE_QUESTION": {
    "KEY": "DELETE_QUESTION",
    "DESCRIPTION": "Delete a question",
    "GROUP_NAME": "Questionnaire",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-10-27T00:00:00.000Z"
  },
  // Member login
  "VIEW_MEMBER_LOGIN": {
    "KEY": "VIEW_MEMBER_LOGIN",
    "DESCRIPTION": "Tracking member login",
    "GROUP_NAME": "Member Login",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-10-29T00:00:00.000Z"
  },
  // Fiat Transaction
  "VIEW_LIST_FIAT_TRANSACTION": {
    "KEY": "VIEW_LIST_FIAT_TRANSACTION",
    "DESCRIPTION": "Search list fiat transaction",
    "GROUP_NAME": "Fiat Transaction",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-11-02T00:00:00.000Z"
  },
  "VIEW_FIAT_TRANSACTION_DETAIL": {
    "KEY": "VIEW_FIAT_TRANSACTION_DETAIL",
    "DESCRIPTION": "View fiat transaction detail",
    "GROUP_NAME": "Fiat Transaction",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-11-02T00:00:00.000Z"
  },
  "EXPORT_FIAT_TRANSACTION_CSV": {
    "KEY": "EXPORT_FIAT_TRANSACTION_CSV",
    "DESCRIPTION": "Export list fiat transaction csv",
    "GROUP_NAME": "Fiat Transaction",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-11-02T00:00:00.000Z"
  },
  // Nexo
  "VIEW_LIST_NEXO_MEMBER": {
    "KEY": "VIEW_LIST_NEXO_MEMBER",
    "DESCRIPTION": "Search Nexo members",
    "GROUP_NAME": "Nexo",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-11-02T00:00:00.000Z"
  },
  "EXPORT_LIST_NEXO_MEMBER_CSV": {
    "KEY": "EXPORT_LIST_NEXO_MEMBER_CSV",
    "DESCRIPTION": "Export Nexo members to csv",
    "GROUP_NAME": "Nexo",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-11-02T00:00:00.000Z"
  },
  "VIEW_LIST_NEXO_TRANSACTION": {
    "KEY": "VIEW_LIST_NEXO_TRANSACTION",
    "DESCRIPTION": "View list Nexo transaction",
    "GROUP_NAME": "Nexo transaction",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-11-02T00:00:00.000Z"
  },
  "VIEW_NEXO_TRANSACTION_DETAIL": {
    "KEY": "VIEW_NEXO_TRANSACTION_DETAIL",
    "DESCRIPTION": "View Nexo transaction details",
    "GROUP_NAME": "Nexo transaction",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-11-02T00:00:00.000Z"
  },

  // Survey
  "VIEW_LIST_SURVEY": {
    "KEY": "VIEW_LIST_SURVEY",
    "DESCRIPTION": "Search surveys",
    "GROUP_NAME": "Surveys",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-11-13T00:00:00.000Z"
  },
  "VIEW_SURVEY_DETAIL": {
    "KEY": "VIEW_SURVEY_DETAIL",
    "DESCRIPTION": "View survey details",
    "GROUP_NAME": "Surveys",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-11-13T00:00:00.000Z"
  },
  "CREATE_SURVEY": {
    "KEY": "CREATE_SURVEY",
    "DESCRIPTION": "Create new survey",
    "GROUP_NAME": "Surveys",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-11-13T00:00:00.000Z"
  },
  "UPDATE_SURVEY": {
    "KEY": "UPDATE_SURVEY",
    "DESCRIPTION": "Update survey",
    "GROUP_NAME": "Surveys",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-11-13T00:00:00.000Z"
  },
  "DELETE_SURVEY": {
    "KEY": "DELETE_SURVEY",
    "DESCRIPTION": "Delete survey",
    "GROUP_NAME": "Surveys",
    "ROLES": [RoleName.Master, RoleName.Admin, RoleName.Operator1, RoleName.Operator2],
    "INITIALIZED_DATE": "2020-11-13T00:00:00.000Z"
  },

};
