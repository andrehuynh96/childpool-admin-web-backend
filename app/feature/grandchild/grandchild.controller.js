const logger = require("app/lib/logger");
const config = require("app/config");
const StakingAPI = require("app/lib/staking-api")

module.exports = {
	create: async(req, res, next) => {
		try {
			let body = {
				email: req.user.email,
				name: req.body.name,
				partner_type: req.body.partner_type,
				created_by: req.user.id
			}
			let items = await StakingAPI.createGrandchild(body);
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
	getAll: async(req, res, next) => {
		try {
			let items = await StakingAPI.getAllGrandchild();
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
}