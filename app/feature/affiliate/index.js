const express = require('express');
const router = express.Router();

router.use(require("./claim-reward-setting/claim-reward-setting.route"));
router.use(require("./token-payout/token-payout.route"));

module.exports = router;