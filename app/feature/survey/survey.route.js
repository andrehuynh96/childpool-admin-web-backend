const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./survey.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const validator = require('app/middleware/validator.middleware');
const { create, update } = require('./validator');

const router = express.Router();

router.get('/surveys',
  authenticate,
  authority(PermissionKey.VIEW_LIST_SURVEY),
  controller.search
);

router.get('/surveys/:id',
  authenticate,
  authority(PermissionKey.VIEW_SURVEY_DETAIL),
  controller.details
);

router.post('/surveys',
  authenticate,
  validator(create),
  authority(PermissionKey.CREATE_SURVEY),
  controller.createSurvey
);


module.exports = router;
