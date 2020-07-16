const express = require('express');
const router = express.Router();

router.use(require("./claim-reward-setting/claim-reward-setting.route"));
router.use(require("./token-payout/token-payout.route"));
router.use(require("./staking-currency/staking-currency.route"));

module.exports = router;