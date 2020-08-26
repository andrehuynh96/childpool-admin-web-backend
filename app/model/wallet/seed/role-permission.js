const _ = require('lodash');
const Permission = require("app/model/wallet").permissions;
const Role = require("app/model/wallet").roles;
const RolePermission = require("app/model/wallet").role_permissions;
let PermissionKey = Object.assign({}, require("app/model/wallet/value-object/permission-key"));
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = async () => {
  let rolePermission = await RolePermission.findAll();
  const permissionIds = _.uniq(rolePermission.map(item => item.permission_id));
  let roles = await Role.findAll();
  let newPermissions = await Permission.findAll({
    where: {
      id: { [Op.notIn]: permissionIds }
    },
    raw: true
  });
  if (newPermissions.length > 0) {
    roles = Object.assign({}, ...roles.map(ele => { return { [ele.name]: ele.id }; }));
    let data = [];
    newPermissions.forEach(item => {
      const permission = Object.keys(PermissionKey).find(x => x == item.name);
      if (permission) {
        PermissionKey[item.name].ROLES.forEach(ele => {
          data.push({
            role_id: roles[ele],
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