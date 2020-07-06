const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./membership-order.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get(
	'/orders',
	authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_ORDER_LIST),
	controller.search
);

router.get(
	'/orders-csv',
	authenticate,
    authority(PermissionKey.MEMBERSHIP_EXPORT_CSV_ORDERS),
	controller.downloadCSV
);

router.get("/orders/:id",
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_ORDER_DETAIL),
    controller.getOrderDetail
);

router.put("/orders/:id",
    authenticate,
    authority(PermissionKey.MEMBERSHIP_UPDATE_ORDER),
    controller.approveOrder
);

module.exports = router;




/** *******************************************************************/


/**
 * @swagger
 * /web/membership/orders:
 *   get:
 *     summary: search member
 *     tags:
 *       - Membership
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
 *       - name: payment_status
 *         in: query
 *         type: string
 *       - name: email
 *         in: query
 *         type: string
 *       - name: membership_type_id
 *         in: query
 *         type: string
 *       - name: crypto_receive_address
 *         in: query
 *         type: string
 *       - name: bank_account_number
 *         in: query
 *         type: string
 *       - name: from
 *         in: query
 *         type: string
 *       - name: to
 *         in: query
 *         type: string
 *       - name: memo
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
 * /web/membership/orders/{orderId}:
 *   get:
 *     summary: get order detail
 *     tags:
 *       - Membership
 *     description:
 *     parameters:
 *       - name: orderId
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
 * /web/membership/orders/{orderId}:
 *   post:
 *     summary: approve order
 *     tags:
 *       - Membership
 *     description:
 *     parameters:
 *       - name: orderId
 *         in: path
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for login.
 *         schema:
 *            type: object
 *            required:
 *            - action
 *            - node
 *            - password
 *            example:
 *              {
                        "action":1,
                        "note":"note"
                }
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


/** *******************************************************************/
