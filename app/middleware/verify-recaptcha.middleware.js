const config = require('app/config');

module.exports = async function (req, res, next) {
  const recaptcha = req.body['g-recaptcha-response'];
  const isInWhiteListRecaptcha =  config.whitelistReCaptcha.includes(recaptcha);
  if (config.disableRecaptcha || isInWhiteListRecaptcha) {
    return next();
  }

  if (!req.recaptcha.error) {
    next();
  } else {
    return res.badRequest(res.__('RECAPTCHA_INVALID'), 'RECAPTCHA_INVALID');
  }
};
