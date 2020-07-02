const Role = require("app/model/wallet").roles;
const User = require("app/model/wallet").users;
const UserRole = require("app/model/wallet").user_roles;

module.exports = async () => {
  let adminRole = await Role.findOne({
    where: {
      name: "Master"
    }
  });
  let user = await User.findOne({
    where: {
      email: "admin@gmail.com"
    }
  });

  if (user && adminRole) {
    let roleUser = await UserRole.findOne({
      where: {
        user_id: user.id,
        role_id: adminRole.id,
      }
    });

    if (!roleUser) {
      await UserRole.create({
        user_id: user.id,
        role_id: adminRole.id,
      });
    }
  }
};