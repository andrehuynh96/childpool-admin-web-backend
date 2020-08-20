const express = require('express');
const validator = require("app/middleware/validator.middleware");
// const { update } = require("./validator");
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./term.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get('/terms',
  authenticate,
  authority(PermissionKey.VIEW_LIST_TERM),
  controller.getAll
);

router.get('/terms/:id',
  authenticate,
  authority(PermissionKey.VIEW_TERM_DETAIL),
  controller.getDetail
);

router.post('/terms',
  authenticate,
  authority(PermissionKey.CREATE_TERM),
  controller.create
);

router.put('/terms/:id',
  authenticate,
  authority(PermissionKey.UPDATE_TERM),
  controller.update
);



module.exports = router;