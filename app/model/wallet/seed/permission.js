const Model = require("app/model/wallet").permissions;
const RolePermission = require("app/model/wallet").role_permissions;
const PermissionKey = require("app/model/wallet/value-object/permission-key");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = async () => {
  let models = [];
  let permissions = Object.keys(PermissionKey).map(key => {
    return PermissionKey[key].KEY;
  })
  for (let permission of permissions) {
    let m = await Model.findOne({
      where: {
        name: permission
      }
    })
    if (!m) {
      let model = {
        name: permission,
        description: permission,
        deleted_flg: false,
        created_by: 0,
        updated_by: 0
      }
      models.push(model);
    }
  }
  await Model.bulkCreate(
    models, {
      returning: true
    });

  let permissionObsolete = await Model.findAll({
    where: {
      name: {
        [Op.notIn]: permissions
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
    })
  }
};