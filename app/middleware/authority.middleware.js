const Permission = require('app/model/wallet').permissions;
const RolePermission = require('app/model/wallet').role_permissions;
const PermissionKey = require('app/model/wallet/value-object/permission-key');

module.exports = function (permission) {
    return async function (req, res, next) {
      if (!req.session || !req.session.authenticated || !req.session.role) {
        res.forbidden();
      } else {
        if (!PermissionKey[permission.KEY]) {
          res.badRequest(res.__("PERMISSION_NOT_FOUND"), "PERMISSION_NOT_FOUND");
        } else {
          if (!req.roles.includes(permission.KEY)) {
            res.forbidden();
          } else {
            next()
          }
        }
      }
    }
  }

