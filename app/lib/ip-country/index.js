const logger = require('app/lib/logger');
const Axios = require('axios');
const config = require('app/config');

module.exports = {
  getCountryLocal: async (req) => {
    try {
      const _ip = _getIpClient(req);
      const result = await Axios.get(`https://freegeoip.app/json/${_ip}`);
      const data = {
        data: result.data,
        headers: req.headers
      }
      return data;
    } catch (err) {
      logger.error("getCountryLocal: ", err);
      throw err;
    }
  },
  isAllowCountryLocal: async (req) => {
    try {
      const _ip = _getIpClient(req);
      const _country = await Axios.get(`https://freegeoip.app/json/${_ip}`);
      const _CountryWhitelist = config.membership.countryWhitelist.split(',')
      return _CountryWhitelist.indexOf(_country.data.country_code) > -1;
    } catch (err) {
      logger.error("isExistCountryLocal: ", err);
    }
    return false;
  },
  getIpClient: (req) => {
    try {
      return _getIpClient(req);
    } catch (err) {
      logger.error("getIpClient: ", err);
    }
    return false;
  },
}

function _getIpClient(req) {
  const registerIp = (req.headers['x-forwarded-for'] || req.headers['x-client-ip'] || req.ip);
  let ips = registerIp.split(",");
  if (ips.length > 0) {
    return ips[0].trimStart().trimEnd();
  }

  return "";
}