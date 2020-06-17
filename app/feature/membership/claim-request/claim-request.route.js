const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./claim-request.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const validator = require("app/middleware/validator.middleware");
const requestSchema = require('./claim-request.request-schema');
const router = express.Router();

router.get(
    '/claim-requests',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_CLAIM_REQUEST_LIST),
    controller.search
);
router.put(
    '/claim-requests/:claimRequestId',
    validator(requestSchema),
    authenticate,
    authority(PermissionKey.MEMBERSHIP_APPROVE_REJECT_CLAIM_REQUEST),
    controller.changeStatus
);

router.get(
	'/claim-requests/csv',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_EXPORT_CSV_CLAIM_REQUESTS),
	controller.downloadCSV
);

router.get(
	'/claim-requests/payment-type',
    authenticate,
	controller.getPaymentType
);

router.get(
	'/claim-requests/crypto-platform',
    authenticate,
	controller.getCryptoPlatform
);

module.exports = router;

/** *******************************************************************/
/**
 * @swagger
 * /web/membership/claim-requests:
 *   get:
 *     summary: search claim request
 *     tags:
 *       - Claim Request
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
 *       - name: from_date
 *         in: query
 *         type: string
 *       - name: to_date
 *         in: query
 *         type: string
 *       - name: email
 *         in: query
 *         type: string
 *       - name: status
 *         in: query
 *         type: string
 *       - name: payment
 *         in: query
 *         type: string
 *       - name: crypto_platform
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
                                "id": 1,
                                "member_id": "8337b3e4-b8be-4594-bca3-d6dba7c751ea",
                                "member_account_id": 1,
                                "type": "Bank",
                                "status": "Pending",
                                "amount": "0",
                                "currency_symbol": "ETH",
                                "created_at": "2020-05-29T06:15:07.006Z"
                            },
                            {
                                "id": 2,
                                "member_id": "8337b3e4-b8be-4594-bca3-d6dba7c751ea",
                                "member_account_id": 1,
                                "type": "Bank",
                                "status": "Approved",
                                "amount": "0",
                                "currency_symbol": "ETH",
                                "created_at": "2020-05-29T06:15:07.006Z"
                            }
                        ],
                        "offset": 0,
                        "limit": 10,
                        "total": 1
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
 * /web/membership/claim-request/{claimRequestId}:
 *   put:
 *     summary: update member
 *     tags:
 *       - Members
 *     description: update user profile
 *     parameters:
 *       - name: claimRequestId
 *         in: path
 *         type: integer
 *         required: true
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to update.
 *         schema:
 *            type: object
 *            required:
 *            - status
 *            example:
 *                  {
                        "status":"Approved | Rejected"
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
 * /web/membership/claim-requests/csv:
 *   get:
 *     summary: export csv claim request
 *     tags:
 *       - Claim Request
 *     description:
 *     parameters:
 *       - name: from_date
 *         in: query
 *         type: string
 *       - name: to_date
 *         in: query
 *         type: string
 *       - name: email
 *         in: query
 *         type: string
 *       - name: status
 *         in: query
 *         type: string
 *       - name: payment
 *         in: query
 *         type: string
 *       - name: crypto_platform
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
/**
 * @swagger
 * /web/membership/claim-requests/payment-type:
 *   get:
 *     summary: get claim request payment types
 *     tags:
 *       - Claim Request
 *     description:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                        "Bank": "Bank",
                        "Crypto": "Crypto"
                    }
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
/**
 * @swagger
 * /web/membership/claim-requests/crypto-platform:
 *   get:
 *     summary: get claim request crypto platforms
 *     tags:
 *       - Claim Request
 *     description:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                        "ETH": {
                            "symbol": "ETH",
                            "name": "Ethereum"
                        },
                        "ATOM": {
                            "symbol": "ATOM",
                            "name": "Cosmos"
                        },
                        "IRIS": {
                            "symbol": "IRIS",
                            "name": "Iris"
                        },
                        "ONT": {
                            "symbol": "ONT",
                            "name": "Ontology"
                        }
                    }
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
