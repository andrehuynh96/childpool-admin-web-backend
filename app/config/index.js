/* eslint no-process-env: "off"*/
require('dotenv').config();
const pkg = require('../../package.json');

const logFolder = process.env.LOG_FOLDER || './public/logs';

const config = {
  logger: {
    level: process.env.LOG_LEVEL || "debug",
    console: {
      enable: true,
      level: process.env.LOG_LEVEL || "debug",
    },
    defaultLevel: 'debug',
    file: {
      compress: false,
      app: `${logFolder}/app.log`,
      error: `${logFolder}/error.log`,
      access: `${logFolder}/access.log`,
      format: '.yyyy-MM-dd',
    },
    appenders: ['CONSOLE', 'FILE', 'ERROR_ONLY'],
  },
  corsDomain: process.env.CORS_DOMAINS,
  rateLimit: process.env.RATE_LIMIT ? parseInt(process.env.RATE_LIMIT) : 100,
  recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
  recaptchaSecret: process.env.RECAPTCHA_SECRET,
  app: {
    name: process.env.APP_NAME || 'staking-childpool-admin-web-backend',
    version: pkg.version,
    description: pkg.description,
    buildNumber: process.env.BUILD_NUMBER || '',
    port: parseInt(process.env.PORT || process.env.APP_PORT),
  },
  db: {
    wallet: {
      database: process.env.WALLET_DB_NAME,
      username: process.env.WALLET_DB_USER,
      password: process.env.WALLET_DB_PASS,
      options: {
        host: process.env.WALLET_DB_HOST,
        port: process.env.WALLET_DB_PORT,
        dialect: 'postgres',
        logging: process.env.POSTPRES_DEBUG === 'true',
      }
    }
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    prefix: process.env.REDIS_PREFIX || 'staking:wallet:cache',
    usingPass: process.env.REDIS_USING_PASS || 0,
    pass: process.env.REDIS_PASS,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE.toLowerCase() === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  mailSendAs: process.env.MAIL_SEND_AS || 'no-reply@infinito.io',
  disableRecaptcha: process.env.DISABLE_RECAPTCHA == "1",
  CDN: {
    url: process.env.CDN_URL,
    accessKey: process.env.CDN_ACCESS_KEY,
    secretKey: process.env.CDN_SECRET_KEY,
    bucket: process.env.CDN_BUCKET,
    folderPlatform: process.env.CDN_FOLDER_PLATFORM,
    exts: process.env.CDN_FILE_EXT ? process.env.CDN_FILE_EXT.split(',')
      : [],
    fileSize: process.env.CDN_FILE_SIZE ? parseFloat(process.env.CDN_FILE_SIZE) : 5242880
  },
  enableDocsLink: process.env.ENABLE_DOCS_LINK == "1",
  expiredVefiryToken: process.env.EXPIRED_VERIFY_TOKEN ? parseInt(process.env.EXPIRED_VERIFY_TOKEN) : 2,
  expiredConfirmIpToken: process.env.EXPIRED_CONFIRM_IP_TOKEN ? parseInt(process.env.EXPIRED_CONFIRM_IP_TOKEN) : 2,
  website: {
    url: process.env.WEBSITE_URL,
    urlActiveUser: process.env.WEBSITE_URL + '/active-user?token=',
    urlSetNewPassword: process.env.WEBSITE_URL + '/set-new-password?token=',
    urlConfirmNewIp: process.env.WEBSITE_URL + '/confirm-ip?token=',
    urlConfirmRequest: process.env.WEBSITE_URL + '/confirm-request?token=',
    urlImages: process.env.PARTNER_NAME ? process.env.WEBSITE_URL + '/' + process.env.PARTNER_NAME.toLowerCase() : process.env.WEBSITE_URL,
  },
  stakingApi: {
    url: process.env.STAKING_API_URL,
    key: process.env.STAKING_API_KEY,
    secret: process.env.STAKING_API_SECRET,
    jwksUrl: process.env.STAKING_API_JWK_URL,
    kid: process.env.STAKING_API_KID,
  },
  enableSeed: process.env.ENABLE_SEED == "1",
  lockUser: {
    maximumTriesLogin: process.env.MAXIMUM_TRIES_LOGIN,
    lockTime: process.env.LOCK_TIME
  },
  emailTemplate: {
    partnerName: process.env.PARTNER_NAME,
    activeAccount: process.env.PARTNER_NAME.toLowerCase() + "/active-account.ejs",
    resetPassword: process.env.PARTNER_NAME.toLowerCase() + "/reset-password.ejs",
    deactiveAccount: process.env.PARTNER_NAME.toLowerCase() + "/deactive-account.ejs",
    confirmNewIp: process.env.PARTNER_NAME.toLowerCase() + "/confirm-ip.ejs",
    confirmRequest: process.env.PARTNER_NAME.toLowerCase() + "/confirm-request.ejs",
    viewRequest: process.env.PARTNER_NAME.toLowerCase() + "/view-request.ejs",
  },
  masterWebsite: {
    urlViewRequest: process.env.MASTER_WEBSITE_URL + '/admin/childpool/detail'
  },
  affiliate: {
    url: process.env.AFFILIATE_URL,
    apiKey: process.env.AFFILIATE_API_KEY,
    secretKey: process.env.AFFILIATE_SECRET_KEY,
    affiliateTypeId: process.env.AFFILIATE_AFFILIATE_TYPE_ID,
    membershipTypeId: process.env.AFFILIATE_MEMBERSHIP_TYPE_ID,
  },
  schedule: {
    updateAffiliate: process.env.SCHEDULE_UPDATE_AFFILIATE_REWARD,
    checkTransactionReward: process.env.SCHEDULE_CHECK_DISTRIBUTE_REWARD,
  },
  sdk: {
    apiKey: process.env.SDK_API_KEY,
    secret: process.env.SDK_SECRET_KEY,
    url: process.env.SDK_URL
  },
  txCreator: {
    host: process.env.TX_CREATOR_HOST,
    ATOM: {
      keyId: process.env.TX_CREATOR_ATOM_KEY_ID,
      serviceId: process.env.TX_CREATOR_ATOM_SERVICE_ID,
      index: process.env.TX_CREATOR_ATOM_INDEX,
      testNet: process.env.TX_CREATOR_ATOM_TESTNET,
      feeDenom: process.env.TX_CREATOR_ATOM_FEEDENOM || 'uatom',
      gas: process.env.TX_CREATOR_ATOM_GAS_LIMIT ? parseInt(process.env.TX_CREATOR_ATOM_GAS_LIMIT) : 250000,
      confirmBlock: process.env.ATOM_DEFAULT_CONFIRM_BLOCK || 5,

    },
    IRIS: {
      keyId: process.env.TX_CREATOR_IRIS_KEY_ID,
      serviceId: process.env.TX_CREATOR_IRIS_SERVICE_ID,
      index: process.env.TX_CREATOR_IRIS_INDEX,
      testNet: process.env.TX_CREATOR_IRIS_TESTNET,
      feeDenom: process.env.TX_CREATOR_IRIS_FEEDENOM || 'iris-atto',
      gas: process.env.TX_CREATOR_IRIS_GAS_LIMIT ? parseInt(process.env.TX_CREATOR_IRIS_GAS_LIMIT) : 50000,
      rateGasPrice: process.env.TX_CREATOR_IRIS_RATE_GAS_PRICE ? parseInt(process.env.TX_CREATOR_IRIS_RATE_GAS_PRICE) : 1e9,
      confirmBlock: process.env.IRIS_DEFAULT_CONFIRM_BLOCK || 5,
    },
    ONT: {
      keyId: process.env.TX_CREATOR_ONT_KEY_ID,
      serviceId: process.env.TX_CREATOR_ONT_SERVICE_ID,
      index: process.env.TX_CREATOR_ONT_INDEX,
      testNet: process.env.TX_CREATOR_ONT_TESTNET,
      gasLimit: process.env.TX_CREATOR_ONT_GAS_LIMIT ? parseInt(process.env.TX_CREATOR_ONT_GAS_LIMIT) : 50000,
      gasPrice: process.env.TX_CREATOR_ONT_GAS_PRICE ? parseInt(process.env.TX_CREATOR_ONT_GAS_PRICE) : 1e9,
      confirmBlock: process.env.ONT_DEFAULT_CONFIRM_BLOCK || 5,
    },
  },
  ONT: {
    restUrl: process.env.ONT_REST_SERVER_URL
  },
  stakingCurrency: process.env.STAKING_CURRENCY
};

module.exports = config;