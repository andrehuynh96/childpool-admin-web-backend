const _ = require('lodash');
const Model = require("app/model/wallet").permissions;
const RolePermission = require("app/model/wallet").role_permissions;
const PermissionKey = require("app/model/wallet/value-object/permission-key");
const Sequelize = require('sequelize');
const { forEach } = require('p-iteration');
const moment = require('moment');

const Op = Sequelize.Op;
const START_SPRINT_DATE = moment("2020-10-26T00:00:00.000Z");

module.exports = async () => {
  const models = [];
  const initPermissionNameCache = {};
  const obsoletePermissionIdList = [];
  const allPermissions = await Model.findAll({});

  await forEach(Object.keys(PermissionKey), async key => {
    const value = PermissionKey[key];
    let { KEY: permissionKey, GROUP_NAME: groupName, DESCRIPTION: description } = value;
    let m = allPermissions.find(item => item.name === permissionKey);
    initPermissionNameCache[permissionKey] = true;

    if (!m) {
      let model = {
        name: permissionKey,
        description: description || _.capitalize(_.replace(permissionKey, /_/g, ' ')),
        group_name: groupName,
        deleted_flg: false,
        initialized_date: moment(value.INITIALIZED_DATE),
        created_by: 0,
        updated_by: 0
      };
      models.push(model);
    }
  });

  if (models.length) {
    await Model.bulkCreate(
      models, {
      returning: true
    });
  }

  allPermissions.forEach(permission => {
    const diff = START_SPRINT_DATE.diff(moment(permission.initialized_date), 'seconds');

    if (!initPermissionNameCache[permission.name] && diff >= 0) {
      obsoletePermissionIdList.push(permission.id);
      console.log('Remove permission ', permission.name, permission.id);
    }
  });

  if (obsoletePermissionIdList.length > 0) {
    console.log('Remove ids: ', obsoletePermissionIdList);
    await RolePermission.destroy({
      where: {
        permission_id: {
          [Op.in]: obsoletePermissionIdList,
        }
      }
    });

    await Model.destroy({
      where: {
        id: {
          [Op.in]: obsoletePermissionIdList,
        }
      }
    });
  }
};
