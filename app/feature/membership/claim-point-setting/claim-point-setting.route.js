const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./claim-point-setting.controller');
const authority = require('app/middleware/authority.middleware');
const validator = require("app/middleware/validator.middleware");
const { update } = require("./validator");
const PermissionKey = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.get('/claim-points/settings',
  authenticate,
  authority(PermissionKey.VIEW_CLAIM_MS_POINT_SETTINGS),
  controller.get
);

router.put('/claim-points/settings',
  authenticate,
  authority(PermissionKey.UPDATE_CLAIM_MS_POINT_SETTINGS),
  validator(update),
  controller.update
);
module.exports = router;

