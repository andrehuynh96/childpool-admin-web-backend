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
/**
 * @swagger
 * /web/membership/members/:memberId/member-kycs:
 *   get:
 *     summary: get all member kyc
 *     tags:
 *       - Member
 *     description:
 *     parameters:
 *       - name: memberId
 *         in: path
 *         type: string
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                    "data": [
                        {
                            "id": 12,
                            "member_id": "a8ba659b-d90d-4ee3-8980-639c74c0eb2f",
                            "kyc_id": 2,
                            "updated_by": 0,
                            "status": "Approved",
                            "createdAt": "2020-07-07T04:40:51.034Z",
                            "updatedAt": "2020-07-07T04:40:51.034Z",
                            "MemberKycProperties": [
                                {
                                    "id": 11,
                                    "member_kyc_id": 12,
                                    "property_id": 3,
                                    "field_name": "Full Name",
                                    "field_key": "fullname",
                                    "value": "Thai Huy",
                                    "createdAt": "2020-07-07T04:40:53.055Z",
                                    "updatedAt": "2020-07-07T04:40:53.055Z"
                                },
                                {
                                    "id": 12,
                                    "member_kyc_id": 12,
                                    "property_id": 4,
                                    "field_name": "Country",
                                    "field_key": "country",
                                    "value": "VietNam",
                                    "createdAt": "2020-07-07T04:40:53.055Z",
                                    "updatedAt": "2020-07-07T04:40:53.055Z"
                                },
                                {
                                    "id": 13,
                                    "member_kyc_id": 12,
                                    "property_id": 5,
                                    "field_name": "City",
                                    "field_key": "city",
                                    "value": "HCM",
                                    "createdAt": "2020-07-07T04:40:53.055Z",
                                    "updatedAt": "2020-07-07T04:40:53.055Z"
                                },
                                {
                                    "id": 14,
                                    "member_kyc_id": 12,
                                    "property_id": 6,
                                    "field_name": "Date of birth",
                                    "field_key": "date_of_birth",
                                    "value": "2020-07-07T04:28:26.390Z",
                                    "createdAt": "2020-07-07T04:40:53.055Z",
                                    "updatedAt": "2020-07-07T04:40:53.055Z"
                                }
                            ]
                        },
                        {
                            "id": 4,
                            "member_id": "a8ba659b-d90d-4ee3-8980-639c74c0eb2f",
                            "kyc_id": 1,
                            "updated_by": 0,
                            "status": "Approved",
                            "createdAt": "2020-07-07T03:12:53.669Z",
                            "updatedAt": "2020-07-07T03:12:53.669Z",
                            "MemberKycProperties": [
                                {
                                    "id": 3,
                                    "member_kyc_id": 4,
                                    "property_id": 1,
                                    "field_name": "Email",
                                    "field_key": "email",
                                    "value": "huyht+910@blockchainlabs.asia",
                                    "createdAt": "2020-07-07T03:12:53.928Z",
                                    "updatedAt": "2020-07-07T03:12:53.928Z"
                                }
                            ]
                        }
                    ]
                }
 *       400:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/400'
 *       401:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/401'
 *       404:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/404'
 *       500:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/500'
 */

router.get(
    '/members/:memberId/member-kycs/:memberKycId',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_MEMBER_KYC_DETAIL),
    controller.getMemberKycDetail
);

module.exports = router;