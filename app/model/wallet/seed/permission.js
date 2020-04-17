const Model = require("app/model/wallet").permissions;
const PermissionKey = require("app/model/wallet/value-object/permission-key");

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

};