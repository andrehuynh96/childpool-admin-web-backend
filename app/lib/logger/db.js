const Logging = require('app/model/wallet').loggings;

module.exports = async(error,address) => {
  const data = {
    type: 'DAILY_REWARD',
    message: JSON.stringify(error),
    wallet_address: address || ''

  };
  await Logging.create(data);
};
