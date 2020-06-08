const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger")
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();
// const { getToken } = require("./token")

module.exports = {
    searchMember: async (query) => {
        try {
            let limit = query.limit ? parseInt(query.limit) : 10;
            let offset = query.offset ? parseInt(query.offset) : 0;
            
            let queryString = `limit=${limit}&offset=${offset}`;
            if (query.name) queryString = queryString +`&name=${query.name}`;
            if (query.email) queryString = queryString +`&email=${query.email}`;
            if (query.membershipTypeId) queryString = queryString +`&membershipTypeId=${query.membershipTypeId}`;
            if (query.referralCode) queryString = queryString +`&referralCode=${query.referralCode}`;
            if (query.referrer) queryString = queryString +`&referrer=${query.referrer}`;
            console.log(queryString);
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
            logger.error("get list member fail:", err);
            return { code: err.response.status, data: err.response.data };
        }
    },
}