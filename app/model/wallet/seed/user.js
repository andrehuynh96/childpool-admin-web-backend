const Model = require("app/model/wallet").users;
const bcrypt = require('bcrypt');

let passWord = bcrypt.hashSync("Abc@123456", 10);
(async () => {
  let count = await Model.count();
  if (count == 0) {
    await Model.bulkCreate([{
      email: "example@gmail.com",
      password_hash: passWord,
      user_sts: "ACTIVATED",
      twofa_enable_flg: false,
      deleted_flg: false,
      created_by: 0,
      updated_by: 0
    }], {
        returning: true
      });
  }
})();