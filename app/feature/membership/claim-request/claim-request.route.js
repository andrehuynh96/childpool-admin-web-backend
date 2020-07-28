const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./claim-request.controller');
const authority = require('app/middleware/authority.middleware');
const parseFormData = require('app/middleware/parse-formdata.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const validator = require("app/middleware/validator.middleware");
const { updateStatus, updateTxid } = require('./validator');
const router = express.Router();

router.get(
    '/claim-requests',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_CLAIM_REQUEST_LIST),
    controller.search
);
router.get(
    '/claim-requests/:claimRequestId',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_CLAIM_REQUEST_DETAIL),
    controller.getDetail
);
router.put(
    '/claim-requests/txid',
    parseFormData,
    validator(updateTxid),
    authenticate,
    authority(PermissionKey.MEMBERSHIP_UPDATE_CLAIM_REQUEST_TX_ID),
    controller.updateTxid
);
router.put(
    '/claim-requests/approves',
    validator(updateStatus),
    authenticate,
    authority(PermissionKey.MEMBERSHIP_APPROVE_CLAIM_REQUEST),
    controller.changeClaimRewardsStatus
);

router.get(
	'/claim-requests-csv',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_EXPORT_CSV_CLAIM_REQUESTS),
	controller.downloadCSV
);

router.get(
	'/payment-types',
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
 *       - name: first_name
 *         in: query
 *         type: string
 *       - name: last_name
 *         in: query
 *         type: string
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
 *       - name: payout_from_date
 *         in: query
 *         type: string
 *       - name: payout_to_date
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
 * /web/membership/claim-request/approves:
 *   put:
 *     summary: Approve claim requests
 *     tags:
 *       - Claim Request
 *     description: update user profile
 *     parameters:
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
                        "claimRequestIds":[203,201,205]
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
 * /web/membership/claim-requests-csv:
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
 * /web/membership/payment-types:
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

 /* #region Get policy details */
/**
 * @swagger
 * /web/membership/claim-requests/:claimrequestId:
 *   get:
 *     summary: Get claim request details
 *     tags:
 *       - Claim Request
 *     description:
 *     parameters:
 *       - in: params
 *         name: claimrequestId
 *         required: true
 *         description: claim request Id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                    "data": {
                        "id": 2,
                        "member": {
                            "email": "myhn@blockchainlabs.asia"
                        },
                        "member_id": "8337b3e4-b8be-4594-bca3-d6dba7c751ea",
                        "member_account_id": 1,
                        "type": "Bank",
                        "status": "Approved",
                        "amount": "1.111",
                        "txid": "0xd025c7532cadcfc9d87feb46bc469ec05d7c4c1dfeb6ae12b8085163e386dfca",
                        "explorer_link": "https://www.blockchain.com/eth/tx/0xd025c7532cadcfc9d87feb46bc469ec05d7c4c1dfeb6ae12b8085163e386dfca",
                        "currency_symbol": "ETH",
                        "created_at": "2020-05-29T06:15:07.006Z"
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
 * /web/membership/claim-requests/:claimrequestId/txid:
 *   put:
 *     summary: update claim request txid
 *     tags:
 *       - Claim Request
 *     description: update claim request txid
 *     parameters:
 *       - name: claimrequestId
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
                        "txid": "0xd025c7532cadcfc9d87feb46bc469ec05d7c4c1dfeb6ae12b8085163e386dfca"
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
/** *******************************************************************/
