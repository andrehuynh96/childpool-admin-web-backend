const express = require('express');
const controller = require('./confirm-ip.controller');
const requestSchema = require('./confirm-ip.request-schema');
const validator = require('app/middleware/validator.middleware');
const router = express.Router();

router.post(
    '/confirm-ip',
    validator(requestSchema),
    controller
  );
module.exports = router;