const _ = require('lodash');
const Permission = require("app/model/wallet").permissions;
const Role = require("app/model/wallet").roles;
const RolePermission = require("app/model/wallet").role_permissions;
let PermissionKey = Object.assign({}, require("app/model/wallet/value-object/permission-key"));
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = async () => {
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
    const cache = Object.keys(PermissionKey).reduce((result, key) => {
      const value = PermissionKey[key];
      result[value.KEY] = value;
      return result;
    }, {});
    const listRole = roles.reduce((result, value) => {
      const roleName = value.name;
      result[roleName] = value.id;
      return result;
    },{});

    let data = [];
    newPermissions.forEach(item => {
      const initPermission =  cache[item.name];
      if (initPermission) {
        initPermission.ROLES.forEach(ele => {
          data.push({
            role_id: listRole[ele],
            permission_id: item.id
          });
        });
      }

    });

    await RolePermission.bulkCreate(data, {
      returning: true
    });
  }
};