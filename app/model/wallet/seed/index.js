const config = require("app/config");

if (config.enableSeed) {
  try {
    require("./user");
    require("./role");
  }
  catch (err) {
    console.log(err)
  }
}