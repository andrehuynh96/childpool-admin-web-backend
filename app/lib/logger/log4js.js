const config = require('app/config');
const { createLogger } = require('staking-logging');

const logger = createLogger(config.app.name);

module.exports = logger;
