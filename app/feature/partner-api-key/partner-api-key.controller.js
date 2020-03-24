const logger = require("app/lib/logger");
const config = require("app/config");
const StakingAPI = require("app/lib/staking-api/partner-api-key")

module.exports = {
    getAll: async(req, res, next) => {
        try {
            let items = await StakingAPI.getAllApiKey(req.params.id);
            if (items.data) {
                return res.ok(items.data);
            }
            else {
                return res.ok([]);
            }
        }
        catch (err) {
            logger.error("get list grandchild fail:", err);
            next(err);
        }
    },
    create: async(req, res, next) => {
		try {
            body = {
                partner_id: req.params.id,
                name: req.body.name,
                user_id: req.session.user.id
            }
            let items = await StakingAPI.createApiKey(body)
            if (items.data) {
				return res.ok(items.data);
			}
			else {
				return res.ok([]);
			}
		}
		catch (err) {
			logger.error("create grandchild fail:", err);
			next(err);
		}
	},
}