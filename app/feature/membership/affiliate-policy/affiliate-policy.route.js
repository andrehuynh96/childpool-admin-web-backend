const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./affiliate-policy.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.get(
    '/affiliate-policies',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_AFFILIATE_POLICY_LIST),
    controller.getAll
);

router.post(
    '/affiliate-policies',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_CREATE_AFFILIATE_POLICY),
    controller.create
);

router.get(
    '/affiliate-policies/:policyId',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_AFFILIATE_POLICY_DETAIL),
    controller.getDetail
);

router.get(
    '/affiliate-policy-types',
    authenticate,
    controller.getTypes
);

router.put(
    '/affiliate-policies/:policyId',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_UPDATE_AFFILIATE_POLICY),
    controller.update
);

/* #region Search policies */
/**
 * @swagger
 * /web/membership/affiliate-policies:
 *   get:
 *     summary: get affiliate policy list
 *     tags:
 *       - Affiliate Policy
 *     description:
 *     parameters:
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *         required: true
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *         required: true
 *
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             { data:
 *                {
                    items: [
                        {
                          "id": 2,
                          "name": "AffiliateSystem - Membership Affiliate Policy",
                          "description": "",
                          "type": "MEMBERSHIP_AFFILIATE",
                          "proportion_share": "20.00000",
                          "max_levels": 4,
                          "rates": [
                              "50",
                              "30",
                              "15",
                              "5"
                          ],
                          "created_at": "2020-03-25T03:59:59.881Z",
                          "updated_at": "2020-03-25T03:59:59.881Z"
                      },
                      {
                          "id": 1,
                          "name": "AffiliateSystem - Membership Policy",
                          "description": "",
                          "type": "MEMBERSHIP",
                          "proportion_share": "10.00000",
                          "max_levels": 4,
                          "membership_rate": {
                              "SILVER": 2,
                              "GOLD": 5,
                              "DIAMOND": 10
                          },
                          "created_at": "2020-03-25T03:59:59.881Z",
                          "updated_at": "2020-03-25T03:59:59.881Z"
                      },
                      {
                          "id": 4,
                          "name": "MembershipSystem - Affiliate Policy",
                          "description": "",
                          "type": "AFFILIATE",
                          "proportion_share": "20.00000",
                          "max_levels": 5,
                          "rates": [
                              "50",
                              "30",
                              "15",
                              "5"
                          ],
                          "created_at": "2020-03-25T03:59:59.881Z",
                          "updated_at": "2020-03-25T03:59:59.881Z"
                      },
                      {
                          "id": 3,
                          "name": "AffiliateSystem - Membership Policy #01",
                          "description": "",
                          "type": "AFFILIATE",
                          "proportion_share": "10.11100",
                          "max_levels": 4,
                          "rates": [
                              "50",
                              "35",
                              "10",
                              "5"
                          ],
                          "created_at": "2020-03-25T03:59:59.881Z",
                          "updated_at": "2020-03-31T04:37:04.801Z"
                      }
                    ],
                    "offset": 0,
                    "limit": 10,
                    "total": 3
                  }
                }
 *       400:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/400'
 *
 *       401:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/401'
 *
 *       404:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/404'
 *
 *       500:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/500'
 */

 /* #region Create a new policy */
/**
 * @swagger
 * /web/membership/affiliate-policies:
 *   post:
 *     summary: Create a new policy
 *     tags:
 *       - Affiliate Policy
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description:
 *         schema:
 *            type: object
 *            required:
 *            - name
 *            example:
 *              {
                  "name": "AffiliateSystem - Membership Policy #01",
                  "description": "",
                  "type": "MEMBERSHIP_AFFILIATE",
                  "proportion_share": 11.11,
                  "max_levels": 5,
                  "rates": [ 
                      50.11,
                      30,
                      11,
                      9
                  ]
                }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                    "data": {
                        "id": 50,
                        "name": "AffiliateSystem - Membership Policy #01",
                        "description": "",
                        "type": "MEMBERSHIP_AFFILIATE",
                        "proportion_share": "13.75",
                        "max_levels": 5,
                        "rates": [
                            "26.11",
                            "12",
                            "25",
                            "5",
                            "7"
                        ],
                        "is_membership_system": false,
                        "created_at": "2020-06-23T07:30:46.267Z",
                        "updated_at": "2020-06-23T07:30:46.267Z"
                    }
                }
 *       400:
 *         description: Bad request
 *         schema:
 *           $ref: '#/definitions/400'
 *
 *       401:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/401'
 *
 *       404:
 *         description: Not found
 *         schema:
 *           $ref: '#/definitions/404'
 *
 *       500:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/500'
 */

 /* #region Get policy details */
/**
 * @swagger
 * /web/membership/affiliate-policies/:policyId:
 *   get:
 *     summary: Get policy details
 *     tags:
 *       - Affiliate Policy
 *     description:
 *     parameters:
 *       - in: params
 *         name: policyId
 *         required: true
 *         description: Policy Id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":{
                      "id": 1,
                      "name": "AffiliateSystem - Membership Policy",
                      "description": "",
                      "type": "MEMBERSHIP",
                      "proportion_share": 10,
                      "max_levels": 4,
                      "membership_rate": {
                          "SILVER": 2,
                          "GOLD": 5,
                          "DIAMOND": 10
                      },
                      "created_at": "2020-03-25T03:59:59.881Z",
                      "updated_at": "2020-03-25T03:59:59.881Z"
                    }
 *             }
 *       400:
 *         description: Bad request
 *         schema:
 *           $ref: '#/definitions/400'
 *
 *       401:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/401'
 *
 *       404:
 *         description: Not found
 *         schema:
 *           properties:
 *             message:
 *              type: string
 *             error:
 *              type: string
 *             code:
 *              type: string
 *             fields:
 *              type: object
 *           example:
 *             message: Policy is not found.
 *             error: error
 *             code: POLICY_IS_NOT_FOUND
 *             fields: ['policyId']
 *
 *       500:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/500'
 */

 /* #region get afffiliate policies type */
/**
 * @swagger
 * /web/membership/affiliate-policy-types:
 *   get:
 *     summary: get affiliate policy types
 *     tags:
 *       - Affiliate Policy
 *     description:
 *     parameters:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                    "data": {
                        "MEMBERSHIP": "MEMBERSHIP",
                        "MEMBERSHIP_AFFILIATE": "MEMBERSHIP_AFFILIATE",
                        "AFFILIATE": "AFFILIATE"
                    }
                }
 *       400:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/400'
 *
 *       401:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/401'
 *
 *       404:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/404'
 *
 *       500:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/500'
 */

module.exports = router;