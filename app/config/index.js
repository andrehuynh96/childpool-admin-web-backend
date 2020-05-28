/*eslint no-process-env: "off"*/
require('dotenv').config();
const logFolder = process.env.LOG_FOLDER || './public/logs';

const config = {
  logger: {
    console: {
      enable: true,
      level: 'debug',
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
  db: {
    wallet: {
      database: process.env.WALLET_DB_NAME,
      username: process.env.WALLET_DB_USER,
      password: process.env.WALLET_DB_PASS,
      options: {
        host: process.env.WALLET_DB_HOST,
        port: process.env.WALLET_DB_PORT,
        dialect: 'postgres',
        logging: false
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
  }
};

module.exports = config;