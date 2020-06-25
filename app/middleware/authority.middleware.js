const PermissionKey = require('app/model/wallet/value-object/permission-key');

module.exports = function (permission) {
  return async function (req, res, next) {
    if (!req.session || !req.session.authenticated || !req.session.permissions) {
      res.forbidden(res.__("PERMISSION_NOT_FOUND"), "PERMISSION_NOT_FOUND");
    } else {
      let exactPermission = permission.KEY;
      if (!PermissionKey[exactPermission]) {
        res.badRequest(res.__("PERMISSION_NOT_FOUND"), "PERMISSION_NOT_FOUND");
      } else {
        if (!req.permissions.includes(exactPermission)) {
          res.forbidden(res.__("PERMISSION_NOT_FOUND"), "PERMISSION_NOT_FOUND");
        } else {
          next();
        }
      }
    }
  };
} ;