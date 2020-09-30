const PermissionKey = require('app/model/wallet/value-object/permission-key');

module.exports = function (permission) {
  return async function (req, res, next) {
    if (!req.session || !req.session.authenticated || !req.session.permissions) {
      return res.forbidden(res.__("PERMISSION_NOT_FOUND"), "PERMISSION_NOT_FOUND");
    }

    let exactPermission = permission ? permission.KEY : null;
    if (!PermissionKey[exactPermission]) {
      return res.badRequest(res.__("PERMISSION_NOT_FOUND"), "PERMISSION_NOT_FOUND");
    }

    if (!req.permissions.includes(exactPermission)) {
      return res.forbidden(res.__("PERMISSION_NOT_FOUND"), "PERMISSION_NOT_FOUND");
    }

    next();
  };
};
