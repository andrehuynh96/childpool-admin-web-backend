const Model = require("app/model/wallet").roles;
const bcrypt = require('bcrypt');

(async () => {
  let count = await Model.count();
  if (count == 0) {
    await Model.bulkCreate([{
      name: "Master",
      root_flg: true,
      level: 0
    },
    {
      name: "Admin",
      level: 10
    },
    {
      name: "Operator1",
      level: 20
    },
    {
      name: "Operator2",
      level: 30
    }], {
        returning: true
      });
  }
})();