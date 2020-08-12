const express = require("express");
const controller = require('./static.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/static/images/:folder/:file',
  authenticate,
  controller.image
);
module.exports = router;