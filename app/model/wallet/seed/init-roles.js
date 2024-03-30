const Permission = require("app/model/wallet").permissions;
const RolePermission = require("app/model/wallet").role_permissions;
const PermissionKey = require("app/model/wallet/value-object/permission-key");
const Role = require("app/model/wallet").roles;
const { forEach } = require('p-iteration');

module.exports = async (roleNameList) => {
  let rolePermissions = [];

  await forEach(roleNameList, async roleName => {
    const role = await Role.findOne({
      where: {
        name: roleName,
      }
    });
    if (!role) {
      return;
    }

    const numOfPermissions = await RolePermission.count({
      where: {
        role_id: role.id
      }
    });
    if (numOfPermissions > 0) {
      return;
    }

    const allPermissions = await Permission.findAll({});
    await forEach(Object.keys(PermissionKey), async key => {
      const value = PermissionKey[key];
      let { KEY: permissionKey, ROLES } = value;
      if (ROLES.indexOf(roleName) <= 0) {
        return;
      }

      let permission = allPermissions.find(item => item.name === permissionKey);
      if (!permission) {
        return;
      }

      let m = await RolePermission.findOne({
        where: {
          permission_id: permission.id,
          role_id: role.id
        }
      });
      if (!m) {
        let model = {
          role_id: role.id,
          permission_id: permission.id
        };

        rolePermissions.push(model);
      }
    });

    if (rolePermissions.length) {
      await RolePermission.bulkCreate(rolePermissions,
        {
          returning: true
        });
    }

  });



};
