const logger = require('app/lib/logger');
const config = require("app/config");

module.exports = {
  getStakingPlatforms: async (req, res, next) => {
    try {
      const stakingPlatforms = (config.stakingPlatform || '').split(',').map(item => {
        return {
          currency_symbol: item,
          name: item,
        };
      });

      return res.ok(stakingPlatforms);
    }
    catch (error) {
      logger.error("get staking currency list fail", error);
      next(error);
    }
  },
};
