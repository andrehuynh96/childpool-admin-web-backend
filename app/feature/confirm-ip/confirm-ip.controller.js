const logger = require('app/lib/logger');
const UserIps = require("app/model/wallet").user_ips;
module.exports = async (req, res, next) => {
    try {
        await UserIps.create({//TODO
            //insert user_ips
            user_id: req.body
        });
        return res.ok(true);
    }
    catch{
        logger.error("create new user ip fail", err);
    }
};