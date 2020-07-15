const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./token-payout.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const validator = require("app/middleware/validator.middleware");
const { updateStatus, updateTxid } = require('./validator');
const router = express.Router();

router.get(
    '/token-payout',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_TOKEN_PAYOUT_VIEW_LIST),
    controller.search
);
router.get(
    '/token-payout/:claimRequestId',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_TOKEN_PAYOUT_VIEW_DETAIL),
    controller.getDetail
);
router.put(
    '/token-payout/:claimRequestId/txid',
    validator(updateTxid),
    authenticate,
    authority(PermissionKey.MEMBERSHIP_TOKEN_PAYOUT_UPDATE_TX_ID),
    controller.updateTxid
);
router.put(
    '/token-payout/approves',
    validator(updateStatus),
    authenticate,
    authority(PermissionKey.MEMBERSHIP_TOKEN_PAYOUT_APPROVE),
    controller.changeClaimRewardsStatus
);

router.get(
	'/token-payout-csv',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_TOKEN_PAYOUT_EXPORT_CSV),
	controller.downloadCSV
);

router.get(
	'/token-payout/payment-type',
    authenticate,
	controller.getPaymentType
);

router.get(
	'/token-payout/crypto-platform',
    authenticate,
	controller.getCryptoPlatform
);

module.exports = router;

/** *******************************************************************/
/**
 * @swagger
 * /web/membership/token-payout:
 *   get:
 *     summary: search Token Payout
 *     tags:
 *       - Token Payout
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
 * /web/membership/token-payout/approves:
 *   put:
 *     summary: Approve Token Payouts
 *     tags:
 *       - Token Payout
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
 * /web/membership/token-payout-csv:
 *   get:
 *     summary: export csv Token Payout
 *     tags:
 *       - Token Payout
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
 * /web/membership/token-payout/payment-type:
 *   get:
 *     summary: get Token Payout payment types
 *     tags:
 *       - Token Payout
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
 * /web/membership/token-payout/crypto-platform:
 *   get:
 *     summary: get Token Payout crypto platforms
 *     tags:
 *       - Token Payout
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
 * /web/membership/token-payout/:claimrequestId:
 *   get:
 *     summary: Get Token Payout details
 *     tags:
 *       - Token Payout
 *     description:
 *     parameters:
 *       - in: params
 *         name: claimrequestId
 *         required: true
 *         description: Token Payout Id
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
 * /web/membership/token-payout/:claimrequestId/txid:
 *   put:
 *     summary: update Token Payout txid
 *     tags:
 *       - Token Payout
 *     description: update Token Payout txid
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
