const config = require("app/config");

if (config.enableSeed) {
  try {
    require("./user");
    require("./role");
    require("./permission");
    require("./role-permission");
  }
  catch (err) {
    console.log(err)
  }
}
require("./root-permission");