const _ = require('lodash');
const Model = require("app/model/wallet").permissions;
const RolePermission = require("app/model/wallet").role_permissions;
const PermissionKey = require("app/model/wallet/value-object/permission-key");
const Sequelize = require('sequelize');
const { forEach } = require('p-iteration');
const moment = require('moment');
const Op = Sequelize.Op;

const START_SPRINT_DATE = new Date(2020,8,26);

module.exports = async () => {
  let models = [];

  // let permissions = Object.keys(PermissionKey).map(key => {
  //   return PermissionKey[key].KEY;
  // });

  const updateModelTasks = [];

  await forEach(Object.keys(PermissionKey), async key => {
    const value = PermissionKey[key];
    let { KEY: permissionKey, GROUP_NAME: groupName, DESCRIPTION: description, CREATED_DATE: created_date } = value;

    let m = await Model.findOne({
      where: {
        name: permissionKey,
      }

    });

    if (!m) {
      let model = {
        name: permissionKey,
        description: description || _.capitalize(_.replace(permissionKey, /_/g, ' ')),
        group_name: groupName,
        deleted_flg: false,
        created_by: 0,
        updated_by: 0
      };
      models.push(model);
    } else {
      if (!m.group_name) {
        m.group_name = groupName;
      }

      if (!m.description || m.description === m.name) {
        m.description = _.capitalize(_.replace(permissionKey, /_/g, ' '));
      }

      updateModelTasks.push(m.save());
    }
  });
  await Promise.all(updateModelTasks);
  await Model.bulkCreate(
    models, {
    returning: true
  });

  const keyObsolete = [];
  Object.values(PermissionKey).forEach(item => {
    if (moment(item).toDate() < START_SPRINT_DATE) {
      keyObsolete.push(item.KEY);
    }
  });

  let permissionObsolete = await Model.findAll({
    where: {
      name: {
        [Op.notIn]: keyObsolete
      }
    },
    raw: true
  });

  if (permissionObsolete && permissionObsolete.length > 0) {
    let ids = permissionObsolete.map(i => i.id);
    await RolePermission.destroy({
      where: {
        permission_id: {
          [Op.in]: ids
        }
      }
    });

    await Model.destroy({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    });
  }
};
