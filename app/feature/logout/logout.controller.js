const logger = require('app/lib/logger');

module.exports = async (req, res, next) => {
  try {
    req.session.authenticated = undefined;
    req.session.user = undefined;
    req.session.role = undefined;
    return res.ok(true);
  }
  catch (err) {
    logger.error("logout: ", err);
    next(err);
  }
}; 