const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./caculate-reward-request.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const router = express.Router();

router.get(
    '/caculate-reward-requests',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_CACULATOR_REWARD_REQUEST_LIST),
    controller.search
);

router.get(
    '/caculate-reward-requests/:requestId',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_CACULATOR_REWARD_REQUEST_DETAIL),
    controller.getDetail
);

router.get(
    '/caculate-reward-requests/:requestId/details',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_CACULATOR_REWARD_REQUEST_DETAIL_LIST),
    controller.getDetailList
);

router.get(
    '/caculate-reward-request-status',
    controller.getStatus
);

router.get(
    '/caculate-reward-request-status/:requestId/details/rewards',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_CACULATOR_REWARD_REQUEST_DETAIL_LIST),
    controller.getRewardList
);

/* #region search caculate reward requests */
/**
 * @swagger
 * /web/membership/affiliate-requests:
 *   get:
 *     summary: Search caculate reward requests
 *     tags:
 *       - Caculate Reward Request
 *     description:
 *     parameters:
 *       - name: from_date
 *         in: query
 *         type: string
 *       - name: to_date
 *         in: query
 *         type: string
 *       - name: status
 *         in: query
 *         type: string
 *       - name: currency
 *         in: query
 *         type: string
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *         required: true
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *         required: true
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
                            "id": "7a5f1990-7b3d-4b6b-9329-8949acce2d7f",
                            "status": "COMPLETED",
                            "currency_symbol": "ETH",
                            "from_date": "2020-03-02T00:00:02.000Z",
                            "to_date": "2020-03-03T00:00:01.000Z",
                            "affiliate_type": "Membership System",
                            "created_at": "2020-06-15T08:43:53.713Z",
                            "updated_at": "2020-06-15T08:43:57.277Z"
                        },
                        {
                            "id": "ed8e290d-9b7e-4833-800a-a785987bd747",
                            "status": "COMPLETED",
                            "currency_symbol": "ETH",
                            "from_date": "2020-03-03T00:00:02.000Z",
                            "to_date": "2020-03-04T00:00:01.000Z",
                            "affiliate_type": "Membership System",
                            "created_at": "2020-06-11T10:09:12.623Z",
                            "updated_at": "2020-06-11T10:09:15.109Z"
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

/* #region Get affiliate request details */
/**
 * @swagger
 * /web/membership/affiliate-requests/:requestId:
 *   get:
 *     summary: Get affiliate request details
 *     tags:
 *       - Caculate Reward Request
 *     description:
 *     parameters:
 *       - in: path
 *         name: requestId
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
 *                data:
 *                {
                    "id": "7a5f1990-7b3d-4b6b-9329-8949acce2d7f",
                    "status": "COMPLETED",
                    "currency_symbol": "ETH",
                    "from_date": "2020-03-02T00:00:02.000Z",
                    "to_date": "2020-03-03T00:00:01.000Z",
                    "created_at": "2020-06-15T08:43:53.713Z",
                    "updated_at": "2020-06-15T08:43:57.277Z"
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

 /* #region View affiliate request detail list */
/**
 * @swagger
 * /web/membership/affiliate-requests/:requestId/details:
 *   get:
 *     summary: View affiliate request detail list
 *     tags:
 *       - Caculate Reward Request
 *     description:
 *     parameters:
 *       - in: path
 *         name: requestId
 *         type: string
 *         required: true
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *         required: true
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
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
                        "items": [
                            {
                                "id": "2",
                                "client_affiliate_id": "93",
                                "ext_client_id": "binh.nt4@blockchainlabs.asia",
                                "status": "COMPLETED",
                                "amount": "20",
                                "currency_symbol": "ETH",
                                "created_at": "2020-06-15T08:43:53.890Z",
                                "updated_at": "2020-06-15T08:43:55.897Z"
                            },
                            {
                                "id": "3",
                                "client_affiliate_id": "91",
                                "ext_client_id": "binh.nt2@blockchainlabs.asia",
                                "status": "COMPLETED",
                                "amount": "5012",
                                "currency_symbol": "ETH",
                                "created_at": "2020-06-15T08:43:53.890Z",
                                "updated_at": "2020-06-15T08:43:57.022Z"
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

 /**
 * @swagger
 * /web/membership//caculate-reward-request-status:
 *   get:
 *     summary: get dropdown list caculate reward request
 *     tags:
 *       - Caculate Reward Request
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
                            "label": "PENDING",
                            "value": "PENDING"
                        },
                        {
                            "label": "PROCESSING",
                            "value": "PROCESSING"
                        },
                        {
                            "label": "COMPLETED",
                            "value": "COMPLETED"
                        },
                        {
                            "label": "FAILED",
                            "value": "FAILED"
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
 * /web/membership/affiliate-requests/:requestId/details/rewards:
 *   get:
 *     summary: get dropdown list caculate reward request
 *     tags:
 *       - Caculate Reward Request
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
                            "id": "176",
                            "client_affiliate_id": "363",
                            "referrer_client_affiliate_id": null,
                            "affiliate_request_detail_id": "213",
                            "from_client_affiliate_id": null,
                            "amount": "4560209298000000000000",
                            "policy_id": 1,
                            "currency_symbol": "IRIS",
                            "commisson_type": "Direct",
                            "membership_order_id": null,
                            "level": null,
                            "status": "Approved",
                            "createdAt": "2020-07-22T11:26:00.887Z",
                            "updatedAt": "2020-07-23T03:15:49.932Z",
                            "clientAffiliateId": "363",
                            "affiliateRequestDetailId": "213",
                            "Policy": {
                                "name": "AffiliateSystem - Membership Policy"
                            }
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
module.exports = router;