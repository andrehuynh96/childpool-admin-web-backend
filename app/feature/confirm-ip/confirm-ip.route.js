const express = require('express');
const controller = require('./confirm-ip.controller');
const router = express.Router();

router.post(
    '/confirm-ip',
    controller
  );
module.exports = router;