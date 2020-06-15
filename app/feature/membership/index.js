const express = require('express');
const router = express.Router();

router.use(require("./bank-account/bank-account.route"));
router.use(require("./receiving-address/receiving-address.route"));

module.exports = router;