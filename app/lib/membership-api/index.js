const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger")
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();
const queryString = require('query-string');
// const { getToken } = require("./token")

module.exports = {
    searchMember: async (query) => {
        try {
            let limit = query.limit ? parseInt(query.limit) : 10;
            let offset = query.offset ? parseInt(query.offset) : 0;
            
            const data = {
                limit: limit,
                offset: offset
            }
            
            if (query.name) data.name = query.name;
            if (query.email) data.email = query.email;
            if (query.membershipTypeId) data.membershipTypeId = query.membershipTypeId;
            if (query.referralCode) data.referralCode = query.referralCode;
            if (query.referrer) data.referrer = query.referrer;
            queryString.stringify(data);
            let accessToken = await getToken();
            let result = await axios.get(`${config.membershipApi.url}/members/?${queryString}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return result.data;
        }
        catch (err) {
            logger.error("get list member fail:", err);
            return { code: err.response.status, data: err.response.data };
        }
    },
    getMemberDetail: async (memberId) =>{
        try {
            let accessToken = await getToken();
            let result = await axios.get(`${config.membershipApi.url}/members/${memberId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return result.data;
        }
        catch (err) {
            logger.error("get member detail fail:", err);
            return { code: err.response.status, data: err.response.data };
        }
    },
    updateMember: async (memberId,body) =>{
        try {
            let accessToken = await getToken();
            let result = await axios.put(`${config.membershipApi.url}/members/${memberId}`, 
            {
                membershipTypeId: body.membershipTypeId,
                referrer: body.referrer
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
            logger.error("update member fail:", err);
            return { code: err.response.status, data: err.response.data };
        }
    },
}