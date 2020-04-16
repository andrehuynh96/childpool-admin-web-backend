const logger = require("app/lib/logger");
const config = require("app/config");
const StakingAPI = require("app/lib/staking-api");

module.exports = {
	create: async(req, res, next) => {
		try {
			let body = {
				email: req.body.email,
				name: req.body.name,
				partner_type: req.body.partner_type,
				created_by: req.user.id
			}
			let items = await StakingAPI.createGrandchild(body);
			if (!items.code) {
				return res.ok(items.data);
			}
			else {
				return res.status(parseInt(items.code)).send(items.data);
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
			if (!items.code) {
				return res.ok(items.data);
			}
			else {
				return res.status(parseInt(items.code)).send(items.data);
			}
		}
		catch (err) {
			logger.error("get list grandchild fail:", err);
			next(err);
		}
	},
	update: async(req, res, next) => {
		try {
			let items = await StakingAPI.updateGrandchild(req.params.id, req.body.name, req.user.id);
			if (!items.code) {
				return res.ok(items.data);
			}
			else {
				return res.status(parseInt(items.code)).send(items.data);
			}
		}
		catch (err) {
			logger.error("update grandchild fail:", err);
			next(err);
		}
	},
	get: async(req, res, next) => {
		try {
			let items = await StakingAPI.getGrandchild(req.params.id);
			if (!items.code) {
				return res.ok(items.data);
			}
			else {
				return res.status(parseInt(items.code)).send(items.data);
			}
		}
		catch (err) {
			logger.error("get grandchild fail:", err);
			next(err);
		}
	}
}