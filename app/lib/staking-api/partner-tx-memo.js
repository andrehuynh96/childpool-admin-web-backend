const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger")
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();
const { getToken } = require("./token")

module.exports = {
    getAll: async (partner_id, limit, offset) => {
        try {
            let accessToken = await getToken();
            let result = await axios.get(`${config.stakingApi.url}/partners/${partner_id}/memos?limit=${limit}&offset=${offset}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return result.data;
        }
        catch (err) {
            logger.error("get list partner tx memo fail:", err);
            return { code: err.response.status, data: err.response.data };
        }
    },
    create: async (partner_id, items, user_id) => {
        try {
            let accessToken = await getToken();
            let result = await axios.post(`${config.stakingApi.url}/partners/${partner_id}/memos`,
                {
                    items: items,
                    user_id: user_id
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            return result.data;
        }
        catch{
            logger.error("create partner tx memo fail:", err);
            return { code: err.response.status, data: err.response.data };
        }
    },
    getHis: async (partner_id, limit, offset) => {
        try {
            let accessToken = await getToken();
            let result = await axios.get(`${config.stakingApi.url}/partners/${partner_id}/memos/histories?limit=${limit}&offset=${offset}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return result.data;
        }
        catch (err) {
            logger.error("get list partner tx memo history fail:", err);
            return { code: err.response.status, data: err.response.data };
        }
    }
}