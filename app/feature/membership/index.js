const express = require('express');
const router = express.Router();

router.use(require("./bank-account/bank-account.route"));

module.exports = router;