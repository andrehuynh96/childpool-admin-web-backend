const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./member.controller');
const validator = require("app/middleware/validator.middleware");
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const {
  membershipType,
  referrer,
  setMaxReferences,
} = require('./validator');

const router = express.Router();

router.get(
  '/members',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_VIEW_MEMBER_LIST),
  controller.search
);

router.get("/members/:memberId",
  authenticate,
  authority(PermissionKey.MEMBERSHIP_VIEW_MEMBER_DETAIL),
  controller.getMemberDetail
);

router.get("/members/:memberId/max-references",
  authenticate,
  authority(PermissionKey.MEMBERSHIP_VIEW_MEMBER_DETAIL),
  controller.getMaxReferences
);

router.put("/members/:memberId/membership-types",
  validator(membershipType),
  authenticate,
  authority(PermissionKey.MEMBERSHIP_UPDATE_MEMBER),
  controller.updateMembershipType
);

router.put("/members/:memberId/referrer-codes",
  validator(referrer),
  authenticate,
  authority(PermissionKey.MEMBERSHIP_UPDATE_MEMBER),
  controller.updaterReferrerCode
);

router.put("/members/:memberId/max-references",
  validator(setMaxReferences),
  authenticate,
  authority(PermissionKey.MEMBERSHIP_UPDATE_MEMBER),
  controller.setMaxReferences
);

router.get("/membership-types",
  controller.getMembershipTypeList,
);

router.get("/member-order-status",
  controller.getMemberOrderStatusFillter,
);

router.get("/kycs",
  controller.getAllKyc,
);

router.get("/members/:memberId/tree-chart",
  authenticate,
  controller.getTreeChart
);

router.get("/members/:memberId/referral-structure",
  authenticate,
  authority(PermissionKey.MEMBERSHIP_VIEW_REFERRAL_STRUCTURE),
  controller.getMemberReferralStructure
);

router.get(
  '/members-csv',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_EXPORT_CSV_MEMBERS),
  controller.downloadCSV
);

router.post(
  '/members/:memberId/resend-active-email',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_VIEW_MEMBER_DETAIL),
  controller.resendActiveEmail
);

module.exports = router;


/** *******************************************************************/


/**
 * @swagger
 * /web/membership/members:
 *   get:
 *     summary: search member
 *     tags:
 *       - Members
 *     description:
 *     parameters:
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: name
 *         in: query
 *         type: string
 *       - name: email
 *         in: query
 *         type: string
 *       - name: membershipTypeId
 *         in: query
 *         type: string
 *       - name: kycStatus
 *         in: query
 *         type: string
 *       - name: referralCode
 *         in: query
 *         type: string
 *       - name: referrer
 *         in: query
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                    "data": {
                        "items": [
                            {
                                "id": "b14a3095-d82a-46c7-9797-478c333c9c83",
                                "email": "ngocmy12a06@gmail.com",
                                "referral_code": "",
                                "referrer_code": "",
                                "kyc_id": "0",
                                "kyc_level": 1,
                                "kyc_status": "Approved",
                                "deleted_flg": false,
                                "plutx_userid_id": "fe61eee1-7540-403f-8bc2-03b9ec134f96"
                            },
                            {
                                "id": "37394288-d0bf-47d3-8886-0ed68642b269",
                                "email": "tommyalan2410@gmail.com",
                                "referral_code": "",
                                "referrer_code": "",
                                "kyc_id": "0",
                                "kyc_level": 1,
                                "kyc_status": "Approved",
                                "deleted_flg": false,
                                "plutx_userid_id": "a4ca67fc-a8db-43be-83dd-e0c843d4b573"
                            }
                        ],
                        "offset": 0,
                        "limit": 10,
                        "total": 2
                    }
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

/**
* @swagger
* /web/membership/members/{memberId}:
*   get:
*     summary: get member detail
*     tags:
*       - Members
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
                   "data": {
                       "id": "8337b3e4-b8be-4594-bca3-d6dba7c751ea",
                       "email": "myhn@blockchainlabs.asia",
                       "referral_code": "CMMGT1VEX",
                       "referrer_code": "",
                       "membership_type_id": 1,
                       "membership_type": "Free",
                       "kyc_id": "5ea90045780db51bed6e756e",
                       "kyc_level": 1,
                       "kyc_status": "Approved",
                       "deleted_flg": false,
                       "plutx_userid_id": "6df1391b-96a7-4207-8640-d331b4e26768"
                   }
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

/**
* @swagger
* /web/membership/members/{memberId}/max-references:
*   get:
*     summary: Get max references of member
*     tags:
*       - Members
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
                "data": {
                    "max_references": 0
                }
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

/**
 * @swagger
 * /web/membership/members/{memberId}/membership-types:
 *   put:
 *     summary: update membershipn type
 *     tags:
 *       - Members
 *     description: update membership type
 *     parameters:
 *       - name: memberId
 *         in: path
 *         type: string
 *         required: true
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to update.
 *         schema:
 *            type: object
 *            required:
 *            - membershipTypeId
 *            - referrerCode
 *            example:
 *                  {
                        "membershipTypeId": "88fda933-0658-49c4-a9c7-4c0021e9a071"
 *                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": true
 *             }
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

/**
* @swagger
* /web/membership/members/{memberId}/referrer-codes:
*   put:
*     summary: update referrer code
*     tags:
*       - Members
*     description: update referrer code
*     parameters:
*       - name: memberId
*         in: path
*         type: string
*         required: true
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON to update.
*         schema:
*            type: object
*            required:
*            - membershipTypeId
*            - referrerCode
*            example:
*                  {
                    "referrerCode": "3ZBCN9HLM"
*                  }
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data": true
*             }
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

/**
* @swagger
* /web/membership/members/{memberId}/max-references:
*   put:
*     summary: Set max references
*     tags:
*       - Members
*     description: Set max references
*     parameters:
*       - name: memberId
*         in: path
*         type: string
*         required: true
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON to update.
*         schema:
*            type: object
*            required:
*            - membershipTypeId
*            - referrerCode
*            example:
*                  {
                    "max_references": 5
*                  }
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data": true
*             }
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

router.put("/members/:memberId/max-references",
  validator(setMaxReferences),
  authenticate,
  authority(PermissionKey.MEMBERSHIP_UPDATE_MEMBER),
  controller.setMaxReferences
);

/**
 * @swagger
 * /web/membership/membership-types:
 *   get:
 *     summary: get dropdown list membership type
 *     tags:
 *       - Members
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
                            "id": "d146bc01-9e56-4664-9788-79e518877f0b",
                            "name": "Free",
                            "price": "0",
                            "currency_symbol": "USD",
                            "type": "Free",
                            "display_order": null,
                            "deleted_flg": false,
                            "createdAt": "2020-06-12T02:20:50.472Z",
                            "updatedAt": "2020-06-12T02:20:50.472Z"
                        },
                        {
                            "id": "88fda933-0658-49c4-a9c7-4c0021e9a071",
                            "name": "Paid",
                            "price": "100",
                            "currency_symbol": "USD",
                            "type": "Paid",
                            "display_order": 1,
                            "deleted_flg": false,
                            "createdAt": "2020-06-12T02:20:50.472Z",
                            "updatedAt": "2020-06-12T02:20:50.472Z"
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

/**
* @swagger
* /web/membership/members/{memberId}/tree-chart:
*   get:
*     summary: get member tree chart
*     tags:
*       - Members
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
*              {
                   "data": {
                       "ext_client_id": "myhn@blockchainlabs.asia",
                       "created_at": "2020-06-18T05:35:36.570Z",
                       "updated_at": "2020-06-18T05:35:36.570Z",
                       "referrer_client_affiliate_id": null,
                       "id": "115",
                       "children": [],
                       "parent": null
                   }
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

/**
 * @swagger
 * /web/membership/kyc-status:
 *   get:
 *     summary: get dropdown list kyc status
 *     tags:
 *       - Members
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
                            "value": "Active",
                            "label": "Active"
                        },
                        {
                            "value": "Verify payment",
                            "label": "Verify payment"
                        },
                        {
                            "value": "Free accepted",
                            "label": "Free accepted"
                        },
                        {
                            "value": "Commission paid",
                            "label": "Commission paid"
                        },
                        {
                            "value": "Deactive",
                            "label": "Deactive"
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

/**
* @swagger
* /web/membership/kycs:
*   get:
*     summary: get dropdown list kycs
*     tags:
*       - Members
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
                           "label": "KYC 0",
                           "value": " 0"
                       },
                       {
                           "label": "KYC 1",
                           "value": " 1"
                       },
                       {
                           "label": "KYC 2",
                           "value": " 2"
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

/** *******************************************************************/

/**
 * @swagger
 * /web/membership/members/:memberId/referral-structure:
 *   get:
 *     summary: View member referral structure API
 *     tags:
 *       - Members
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
                    "data": {
                        "email": "binhnt+3@blockchainlabs.asia",
                        "affiliate": [
                            {
                                "num_of_level_1_affiliates": 2,
                                "num_of_level_2_affiliates": 26,
                                "num_of_level_3_affiliates": 6,
                                "num_of_level_4_affiliates": 0,
                                "total": 32
                            },
                            {
                                "id": "197",
                                "client_id": "228",
                                "level": 3,
                                "ext_client_id": "huy.pq+37@blockchainlabs.asia",
                                "num_of_level_2_affiliates": 5,
                                "num_of_level_3_affiliates": 0,
                                "num_of_level_4_affiliates": 0
                            },
                            {
                                "id": "192",
                                "client_id": "226",
                                "level": 3,
                                "ext_client_id": "binhnt+6@blockchainlabs.asia",
                                "num_of_level_2_affiliates": 21,
                                "num_of_level_3_affiliates": 6,
                                "num_of_level_4_affiliates": 0
                            }
                        ],
                        "referrer_email": "trunglk+142@blockchainlabs.asia"
                    }
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
