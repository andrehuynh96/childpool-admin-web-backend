/*eslint no-process-env: "off"*/
require('dotenv').config();
require('rootpath')();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const database = require('app/lib/database');
const logger = require('app/lib/logger');
const redis = require('app/lib/redis');

database.init(async err => {
  if (err) {
    logger.error(`database start fail:`, err);
    return;
  }

  redis.init(async err => {
    if (err) {
      logger.error(`Redis start fail:`, err);
      return;
    }
    require('app/model').init();
    require('app/worker').start();
    process.on('SIGINT', () => {
      if (redis) {
        redis.quit();
      }
      process.exit(0);
    });
  });
});

process.on('unhandledRejection', function (reason, p) {
  logger.error('unhandledRejection', reason, p);
});

process.on('uncaughtException', err => {
  logger.error('uncaughtException', err);
});
