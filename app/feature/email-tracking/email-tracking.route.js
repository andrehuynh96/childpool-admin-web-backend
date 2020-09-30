const express = require('express');
const controller = require('./email-tracking.controller');

const router = express.Router();

router.get('/email-trackings/:id',
  controller.view
);

module.exports = router;
