const Model = require("app/model/wallet").roles;
const bcrypt = require('bcrypt');

(async () => {
  let count = await Model.count();
  if (count == 0) {
    await Model.bulkCreate([{
      name: "MASTER",
      root_flg: true,
      level: 0
    },
    {
      name: "ADMIN",
      level: 10
    },
    {
      name: " OPERATOR 1",
      level: 20
    },
    {
      name: " OPERATOR 2",
      level: 30
    }], {
        returning: true
      });
  }
})();