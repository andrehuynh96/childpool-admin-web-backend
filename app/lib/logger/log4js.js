const config = require("app/config");
const log4js = require("log4js");

const logLayout = {
  type: "pattern",
  pattern: "%d{yyyy-MM-dd hh:mm:ss.SSS} %p %z %c %m"
};

const appenders = {
  FILE: {
    type: "dateFile",
    filename: config.logger.file.app,
    pattern: config.logger.file.format,
    level: "trace",
    layout: logLayout,
    compress: config.logger.file.compress,
    daysToKeep: 90
  },
  CONSOLE: {
    type: "stdout",
    layout: logLayout,
    level: "trace"
  },
  FILE_ERROR: {
    type: "dateFile",
    filename: config.logger.file.error,
    pattern: config.logger.file.format,
    level: "trace",
    layout: logLayout,
    compress: config.logger.file.compress,
    daysToKeep: 90
  },
  ERROR_ONLY: {
    type: "logLevelFilter",
    appender: "FILE_ERROR",
    level: "error"
  }
};

if (config.hangoutError.isEnabled) {
  appenders.HANGOUT = {
    type: '@kevit/log4js-hangout',
    webhookUrl: config.hangoutError.webhookUrl,
    layout: {
      type: "pattern",
      pattern: `\`${config.app.name}\` %n\`\`\`%d{yyyy-MM-dd hh:mm:ss.SSS} %p %z %m\`\`\``,
    },
    level: "warn",
  };
  appenders.HANGOUT_FILTER = {
    type: 'logLevelFilter',
    appender: 'HANGOUT',
    level: config.hangoutError.logLevel,
  };

  config.logger.appenders.push('HANGOUT_FILTER');
}

log4js.configure({
  pm2: true,
  appenders,
  categories: {
    default: {
      appenders: config.logger.appenders,
      level: config.logger.defaultLevel
    }
  }
});

const instance = log4js.getLogger("Logger");

module.exports = instance;
