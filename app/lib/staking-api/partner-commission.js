const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger");
const { getToken } = require("./token");

module.exports = {
	updateCommission: async (id, items, userId) => {
		try {
			let accessToken = await getToken();
			let result = await axios.post(`${config.stakingApi.url}/partners/${id}/commissions`,
				{
					items, updated_by: userId
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`
					}
				});

			return result.data;
		}
		catch (err) {
			logger[err.canLogAxiosError ? 'error' : 'info']("updateCommission fail:", err);
			return { code: err.response.status, data: err.response.data };
		}
	},
	getAllCommission: async (id, limit, offset) => {
		try {
			let accessToken = await getToken();
			let result = await axios.get(`${config.stakingApi.url}/partners/${id}/commissions?limit=${limit}&offset=${offset}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			return result.data;
		}
		catch (err) {
			logger[err.canLogAxiosError ? 'error' : 'info']("getAllCommission fail:", err);
			return { code: err.response.status, data: err.response.data };
		}
	},
	getCommissionHis: async (id, limit, offset) => {
		try {
			let accessToken = await getToken();
			let result = await axios.get(`${config.stakingApi.url}/partners/${id}/commissions/histories?limit=${limit}&offset=${offset}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			return result.data;
		}
		catch (err) {
			logger[err.canLogAxiosError ? 'error' : 'info']("getCommissionHis fail:", err);
			return { code: err.response.status, data: err.response.data };
		}
	},
	getAllCommissionByPlatform: async (id, limit, offset) => {
		try {
			let accessToken = await getToken();
			let result = await axios.get(`${config.stakingApi.url}/partners/commissions/${id}?limit=${limit}&offset=${offset}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			return result.data;
		}
		catch (err) {
			logger[err.canLogAxiosError ? 'error' : 'info']("getAllCommissionByPlatform fail:", err);
			return { code: err.response.status, data: err.response.data };
		}
	},
	getCommissions: async (id, platform) => {
		try {
			let accessToken = await getToken();
			let result = await axios.get(`${config.stakingApi.url}/partners/${id}/commissions/${platform}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			return result.data;
		}
		catch (err) {
			logger[err.canLogAxiosError ? 'error' : 'info']("getCommissions fail:", err);
			return { code: err.response.status, data: err.response.data };
		}
	},
	getAllCommissionByPartner: async (limit, offset) => {
		try {
			let accessToken = await getToken();
			let result = await axios.get(`${config.stakingApi.url}/me/commissions?limit=${limit}&offset=${offset}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			return result.data;
		}
		catch (err) {
			logger[err.canLogAxiosError ? 'error' : 'info']("getAllCommissionByPlatform fail:", err);
			return { code: err.response.status, data: err.response.data };
		}
	},
};
