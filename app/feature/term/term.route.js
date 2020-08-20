const express = require('express');
const validator = require("app/middleware/validator.middleware");
const schema = require("./term.request-schema");
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

router.get('/terms/:term_no',
  authenticate,
  authority(PermissionKey.VIEW_TERM_DETAIL),
  controller.getDetail
);

router.post('/terms',
  authenticate,
  authority(PermissionKey.CREATE_TERM),
  validator(schema),
  controller.create
);

router.put('/terms/:term_no',
  authenticate,
  authority(PermissionKey.UPDATE_TERM),
  validator(schema),
  controller.update
);



module.exports = router;