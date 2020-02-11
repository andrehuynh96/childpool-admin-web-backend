const Model = require("app/model/staking").roles;
const bcrypt = require('bcrypt');

(async () => {
  let count = await Model.count();
  if (count == 0) {
    await Model.bulkCreate([{
      name: "MASTER"
    },
    {
      name: "ADMIN"
    },
    {
      name: " OPERATOR 1"
    },
    {
      name: " OPERATOR 2"
    }], {
        returning: true
      });
  }
})();