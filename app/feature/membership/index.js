const express = require('express');
const router = express.Router();

router.use(require("./bank-account/bank-account.route"));
router.use(require("./member/member.route"));
router.use(require("./claim-request/claim-request.route"));
router.use(require("./membership-order/membership-order.route"))

module.exports = router;