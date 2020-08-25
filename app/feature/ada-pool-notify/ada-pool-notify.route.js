const express = require('express');
const validator = require("app/middleware/validator.middleware");
const schema = require("./ada-pool-notify.request-schema");
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./ada-pool-notify.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get('/ada-pool-notify',
  authenticate,
  authority(PermissionKey.VIEW_ADA_POOL_NOTIFY_CONFIG_LIST),
  controller.getOne
);

router.get('/ada-pool-notify/histories',
  authenticate,
  authority(PermissionKey.VIEW_ADA_POOL_NOTIFY_CONFIG_LIST),
  controller.getNotificationHistories
);

router.put('/ada-pool-notify',
  authenticate,
  authority(PermissionKey.UPDATE_ADA_POOL_NOTIFY_CONFIG),
  validator(schema),
  controller.update
);

module.exports = router;
