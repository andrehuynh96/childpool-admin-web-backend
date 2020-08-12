const config = require("app/config");

(async () => {
  try {
    await Promise.all([require("./permission")()]);
    await Promise.all([require("./email-template")()]);
    if (config.enableSeed) {
      await Promise.all([require("./user")(), require("./role")()]);
      await Promise.all([require("./role-permission")(), require("./user-role")()]);
    }
    require("./root-permission")();
    console.log('Seeding data done.');
  }
  catch (err) {
    console.log(err);
  }
}
)();
