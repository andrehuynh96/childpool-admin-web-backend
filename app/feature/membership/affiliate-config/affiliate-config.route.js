const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./member.controller');
const validator = require("app/middleware/validator.middleware");
const requestSchema = require('./member.request-schema');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.get(
    '/affiliate-configs',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_MEMBER_LIST),
    controller.getAll
);