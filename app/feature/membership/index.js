const express = require('express');
const router = express.Router();

router.use(require("./bank-account/bank-account.route"));
router.use(require("./receiving-address/receiving-address.route"));
router.use(require("./membership-order/membership-order.route"))

module.exports = router;