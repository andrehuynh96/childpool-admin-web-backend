const config = require('app/config');

module.exports = async function (req, res, next) {
  if (config.disableRecaptcha) return next();

  if (!req.recaptcha.error) {
    next()
  } else {
    return res.badRequest(res.__('RECAPTCHA_INVALID'), 'RECAPTCHA_INVALID');
  }
};