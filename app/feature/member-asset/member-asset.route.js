const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./member-asset.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const router = express.Router();

router.get('/member-asset',
  authenticate,
  authority(PermissionKey.VIEW_LIST_MEMBER_ASSET),
  controller.search
);
module.exports = router;
