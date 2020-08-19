const express = require('express');
const controller = require('./ada-pool-notify.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const validator = require('app/middleware/validator.middleware');
const schema = require('./ada-pool-notify.request-schema');
const router = express.router();

router.get('/ada-pool-notifies',
    authenticate,
    authority(PermissionKey.VIEW_ADA_POOL_NOTIFY_CONFIG),
    controller.get
);

router.put('/ada-pool-notifies',
    authenticate,
    authority(PermissionKey.UPDATE_ADA_POOL_NOTIFY_CONFIG),
    validator(schema),
    controller.update
)

router.get('/ada-pool-notifies/histories',
    authenticate,
    authority(PermissionKey.VIEW_ADA_POOL_NOTIFY_CONFIG_HISTORY),
    controller.getHis
)
