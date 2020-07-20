const express = require('express');
const router = express.Router();

router.use(require("./claim-reward-setting/claim-reward-setting.route"));

module.exports = router;