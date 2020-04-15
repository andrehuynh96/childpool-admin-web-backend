const Permission = require("app/model/wallet").permissions;
const RolePermission = require("app/model/wallet").role_permissions;
const Role = require("app/model/wallet").roles;

(async () => {
  let models = []
  let permissions = await Permission.findAll({
    attribute: ["id"],
  })
  let root = await Role.findOne({
    where: {
      root_flg: true
    }
  })
  permissions = permissions.map(ele => ele.id)
  for (let permission_id of permissions) {
    let m = await RolePermission.findOne({
      where: {
        permission_id: permission_id,
        role_id: root.id
      }
    })
    if (!m) {
      let model = {
        role_id: root.id,
        permission_id: permission_id
      }
      models.push(model);
    }
  }
  await RolePermission.bulkCreate(
    models, {
      returning: true
    });
})();