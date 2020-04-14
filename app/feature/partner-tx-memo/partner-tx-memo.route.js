const express = require("express");
const controller = require("./partner-tx-memo.controller");
const { create } = require("./validator");
const validator = require("app/middleware/validator.middleware");
const authenticate = require('app/middleware/authenticate.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get(
    '/partners/:partner_id/memos',
    authenticate,
    authority(PermissionKey.VIEW_LIST_PARTNER_TX_MEMO),
    controller.getAll
);

router.post(
    '/partners/:partner_id/memos',
    validator(create),
    authenticate,
    authority(PermissionKey.CREATE_PARTNER_TX_MEMO),
    controller.create
);
router.get(
    '/partners/:partner_id/memos/histories',
    authenticate,
    authority(PermissionKey.VIEW_LIST_PARTNER_TX_MEMO_HISTORY),
    controller.getHis
);
module.exports = router;