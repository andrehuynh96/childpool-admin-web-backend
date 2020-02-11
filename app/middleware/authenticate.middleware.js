module.exports = function (req, res, next) {
  if (!req.session || !req.session.authenticated || !req.session.user) {
    res.unauthorized();
  } else {
    req.user = req.session.user;
    next()
  }
}