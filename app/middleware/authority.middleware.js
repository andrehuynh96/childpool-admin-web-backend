const Roles = require('app/model/wallet').roles;
const userRoles = require('app/model/wallet').user_roles;
const PermissionKey = require('app/model/wallet/value-object/permission-key');
module.exports = function (permission) {
  return async function (req, res, next) {
    if (!req.session || !req.session.authenticated || !req.session.role) {
      res.forbidden();
    } else {
      let exactPermission = permission.KEY;
      if (permission.KEY == 'CREATE_USER' || permission.KEY == 'UPDATE_USER' || permission.KEY == 'DELETE_USER') {
        let where = {}
        if(req.body.role_id) {
          where.id = req.body.role_id
        }
        else {
          let userRole = await userRoles.findOne({
            where: {
              user_id: req.params.id 
            }
          })
          where.id = userRole.role_id
        }
        let roleName = await Roles.findOne({ where:where })
        exactPermission = permission.KEY + '_' + roleName.name.replace(/ /g, '_').toUpperCase();
      }
      if (!PermissionKey[exactPermission]) {
        res.badRequest(res.__("PERMISSION_NOT_FOUND"), "PERMISSION_NOT_FOUND");
      } else {
        if (!req.roles.includes(exactPermission)) {
          res.forbidden();
        } else {
          next()
        }
      }
    }
  }
}
