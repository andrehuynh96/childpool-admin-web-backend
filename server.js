/*eslint no-process-env: "off"*/
require('dotenv').config();
require('rootpath')();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3001;
const express = require('express');
const morgan = require('morgan');
const http = require('http');
const database = require('app/lib/database');
const logger = require('app/lib/logger');
const redis = require('app/lib/redis');
const loader = require('app/loader');

const app = express();
app.use(morgan('dev'));

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
    loader.init(app);
    app.set('trust proxy', 1);
    app.use('/', require('app/index'));
    app.use(express.static('public'));
    const server = http.createServer(app);
    server.listen(process.env.PORT, function () {
      console.log(`server start successfully on port: ${process.env.PORT}`);
      var exec = require('child_process').exec;
      var cmd = 'npx sequelize-cli db:migrate';
      exec(cmd, function (error, stdout, stderr) {
        console.log('error', error);
        console.log('stdout ', stdout);
        console.log('stderr ', stderr);
      })
    });

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
