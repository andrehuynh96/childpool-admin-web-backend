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

module.exports = router;