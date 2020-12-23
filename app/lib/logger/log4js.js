const config = require('app/config');
const { createLogger } = require('staking-logging');

console.log(config.app.name);
const logger = createLogger(config.app.name);

module.exports = logger;
