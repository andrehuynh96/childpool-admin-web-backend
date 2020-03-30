const Permission = require("app/model/wallet").permissions;
const Role = require("app/model/wallet").roles;
const RolePermission = require("app/model/wallet").role_permissions;
let PermissionKey = Object.assign({}, require("app/model/wallet/value-object/permission-key"));

(async () => {
  let permissions = await Permission.findAll({});
  let roles = await Role.findAll({});
  if (permissions.length > 0 && roles.length > 0) {
    permissions = Object.assign({}, ...permissions.map(ele => { return { [ele.name]: ele.id } }));
    roles = Object.assign({}, ...roles.map(ele => { return { [ele.name]: ele.id } }));
    await RolePermission.destroy({
      where: {}
    });
    let data = [];
    Object.keys(PermissionKey).forEach(key => {
      PermissionKey[key].ROLES.map(ele => {
        data.push({
          role_id: roles[ele],
          permission_id: permissions[key]
        } )
      });
    });
    await RolePermission.bulkCreate(data, {
      returning: true
    });
  }
})();