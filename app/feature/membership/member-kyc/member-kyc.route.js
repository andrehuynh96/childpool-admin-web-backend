const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./member-kyc.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.get(
    '/members/:memberId/member-kycs',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_MEMBER_KYC_LIST),
    controller.getAllMemberKyc
);

router.get(
    '/member-kycs/:memberKycId',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_MEMBER_KYC_DETAIL),
    controller.getMemberKycDetail
);

router.put(
    '/member-kycs/:memberKycId',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_UPDATE_MEMBER_KYC_STATUS),
    controller.updateStatus
);

module.exports = router;