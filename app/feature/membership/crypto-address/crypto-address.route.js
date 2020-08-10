const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./crypto-address.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get('/crypto-address',
    authenticate,
    authority(PermissionKey.VIEW_LIST_CRYPTO_ADDRESS),
    controller.search
);

module.exports = router;
