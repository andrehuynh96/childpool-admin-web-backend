const config = require("app/config");
const RoleName = require('../value-object/role-name');

(async () => {
  try {
    await Promise.all([
      require("./permission")(),
      require("./setting")(),
      require("./country")(),
      require("./role")(),
      require("./email-template")(),
      require("./member-setting")(),
    ]);

    if (config.enableSeed) {
      await require("./init-roles")([RoleName.KoreanOperator]);

      await Promise.all([
        require("./user")(),
      ]);
      await Promise.all([
        require("./role-permission")(),
        require("./user-role")(),
      ]);
    }

    await require("./root-permission")();
    await require("./term")();
    require("./migrate-infinito-user")();
    console.log('Seeding data done.');
  }
  catch (err) {
    console.log(err);
  }
}
)();
