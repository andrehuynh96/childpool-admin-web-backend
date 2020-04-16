const logger = require('app/lib/logger');
const StakingAPI = require("app/lib/staking-api");

module.exports = {
  revokeAPIKey: async (req, res, next) => {
    try {
      let items = await StakingAPI.revokeAPIKey(req.params.id, req.params.key);
			if (!items.code) {
				return res.ok(items.data);
			}
			else {
				return res.status(parseInt(items.code)).send(items.data);
			}
    }
    catch (err) {
      logger.error('revoke API Key fail:', err);
      next(err);
    }
  }
}
