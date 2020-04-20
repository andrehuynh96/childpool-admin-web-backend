module.exports = function (req, res, next) {
  if (!req.session.roles) {
    res.forbidden();
  }
  let root = req.session.roles.filter(x => x.root_flg == true);
  if (!root || root.length == 0) {
    res.forbidden();
  }
  next()
}