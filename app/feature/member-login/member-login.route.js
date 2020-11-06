const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./member-login.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const router = express.Router();

router.get('/member-logins',
  authenticate,
  authority(PermissionKey.VIEW_MEMBER_LOGIN),
  controller.get
);

module.exports = router;

