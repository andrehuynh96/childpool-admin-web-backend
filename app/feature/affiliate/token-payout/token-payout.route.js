const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./token-payout.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const parseFormData = require('app/middleware/parse-formdata.middleware');
const validator = require("app/middleware/validator.middleware");
const { updateStatus, updateTxid, updateTxidCSV } = require('./validator');
const router = express.Router();

router.get(
    '/token-payout',
    authenticate,
    authority(PermissionKey.AFFILIATE_TOKEN_PAYOUT_VIEW_LIST),
    controller.search
);

router.get(
    '/token-payout/detail/:tokenPayoutId',
    authenticate,
    authority(PermissionKey.AFFILIATE_TOKEN_PAYOUT_VIEW_DETAIL),
    controller.getDetail
);

router.put(
    '/token-payout/update/:tokenPayoutId/txid',
    validator(updateTxid),
    authenticate,
    authority(PermissionKey.AFFILIATE_TOKEN_PAYOUT_UPDATE_TX_ID),
    controller.updateTxid
);

router.post(
    '/token-payout/update/txid/csv',
    parseFormData,
    validator(updateTxidCSV),
    authenticate,
    authority(PermissionKey.AFFILIATE_TOKEN_PAYOUT_UPDATE_TX_ID),
    controller.updateTxidCSV
);

router.put(
    '/token-payout/approves',
    validator(updateStatus),
    authenticate,
    authority(PermissionKey.AFFILIATE_TOKEN_PAYOUT_APPROVE),
    controller.changeClaimRewardsStatus
);

router.get(
    '/token-payout-csv',
    authenticate,
    authority(PermissionKey.AFFILIATE_TOKEN_PAYOUT_EXPORT_CSV),
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

/** ******************************************************************/

/**
 * @swagger
 * /web/affiliate/token-payout:
 *   get:
 *     summary: search Token Payout
 *     tags:
 *       - Affiliate
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
* /web/affiliate/token-payout/approves:
*   put:
*     summary: Approve Token Payouts
*     tags:
*       - Affiliate
*     description: update user profile
*     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON to update.
*         schema:
*            type: object
*            required:
*            example:
*                  {
                       "token_payout_ids": [203,123]
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

/**
* @swagger
* /web/affiliate/token-payout-csv:
*   get:
*     summary: export csv Token Payout
*     tags:
*       - Affiliate
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

/**
 * @swagger
 * /web/affiliate/token-payout/payment-type:
 *   get:
 *     summary: get Token Payout payment types
 *     tags:
 *       - Affiliate
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

/**
 * @swagger
 * /web/affiliate/token-payout/crypto-platform:
 *   get:
 *     summary: get Token Payout crypto platforms
 *     tags:
 *       - Affiliate
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
 * /web/affiliate/token-payout/detail/{tokenPayoutId}:
 *   get:
 *     summary: Get Token Payout details
 *     tags:
 *       - Affiliate
 *     description:
 *     parameters:
 *       - in: path
 *         name: tokenPayoutId
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
* /web/affiliate/token-payout/update/{tokenPayoutId}/txid:
*   put:
*     summary: update Token Payout txid
*     tags:
*       - Affiliate
*     description: update Token Payout txid
*     parameters:
*       - name: tokenPayoutId
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

 /**
 * @swagger
 * /web/affiliate/token-payout/txid/csv:
 *   post:
 *     summary: update token payout txid by csv file
 *     tags:
 *       - Affiliate
 *     description: update token payout txid by csv file
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit file
 *         schema:
 *            type: file
 *            required:
 *            - tokenPayoutTxid
 *            example:
 *                  {
                        "tokenPayoutTxid": "txid.csv"
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
