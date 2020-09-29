const config = require("app/config");

(async () => {
  try {
    await Promise.all([require("./permission")(), require("./email-template")()]);
    if (config.enableSeed) {
      await Promise.all([require("./user")(), require("./role")()]);
      await Promise.all([require("./role-permission")(), require("./user-role")()]);
      await require("./member-setting")();
    }
    await require("./root-permission")();
    await require("./term")();
    console.log('Seeding data done.');
  }
  catch (err) {
    console.log(err);
  }
}
)();
