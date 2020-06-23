const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./affiliate-policy.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.get(
    '/affiliate-policies',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_AFFILIATE_POLICY_LIST),
    controller.getAll
);

module.exports = router;