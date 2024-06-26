const _ = require('lodash');
const Permission = require("app/model/wallet").permissions;
const Role = require("app/model/wallet").roles;
const RolePermission = require("app/model/wallet").role_permissions;
let PermissionKey = Object.assign({}, require("app/model/wallet/value-object/permission-key"));
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = async () => {
  console.log('Seeding permissions for all roles...');
  let rolePermissions = await RolePermission.findAll();
  const permissionIds = _.uniq(rolePermissions.map(item => item.permission_id));
  let roles = await Role.findAll();
  let newPermissions = await Permission.findAll({
    where: {
      id: { [Op.notIn]: permissionIds }
    },
    raw: true
  });

  if (newPermissions.length > 0) {
    const permissioncache = Object.keys(PermissionKey).reduce((result, key) => {
      const value = PermissionKey[key];
      result[value.KEY] = value;
      return result;
    }, {});

    const roleCache = roles.reduce((result, value) => {
      const roleName = _.trim(value.name);
      result[roleName] = value.id;

      return result;
    }, {});

    let data = [];
    newPermissions.forEach(item => {
      const initPermission = permissioncache[item.name];
      if (initPermission) {
        console.log(`New permission: ${item.name}`);
        initPermission.ROLES.forEach(roleName => {
          const roleId = roleCache[_.trim(roleName)];
          if (roleId) {
            data.push({
              role_id: roleId,
              permission_id: item.id
            });
          }
        });
      }
    });

    await RolePermission.bulkCreate(data, {
      returning: true
    });
    console.log('Done.');
  }
};
