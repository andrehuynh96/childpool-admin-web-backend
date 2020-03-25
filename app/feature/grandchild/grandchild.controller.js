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
			let limit = req.query.limit ? parseInt(req.query.limit) : 10;
			let offset = req.query.offset ? parseInt(req.query.offset) : 0;

			let items = await StakingAPI.getAllGrandchild(limit,offset);
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