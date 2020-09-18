const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const controller = require('./exchange-transaction.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./exchange-transaction.request-schema');
const router = express.Router();

router.get('/exchange-transactions',
  authenticate,
  validator(requestSchema, 'query'),
  authority(PermissionKey.VIEW_LIST_EXCHANGE_TRANSACTION),
  controller.search
);

/**
* @swagger
* /web/exchange-transactions:
*   get:
*     summary: Search exchange transactions
*     tags:
*       - Exchange
*     description:
*     parameters:
*       - name: offset
*         in: query
*         type: integer
*         format: int32
*       - name: limit
*         in: query
*         type: integer
*       - name: email
*         in: query
*         type: string
*       - name: from_date
*         in: query
*         type: date
*       - name: to_date
*         in: query
*         type: date
*       - name: from_currency
*         in: query
*         type: string
*       - name: to_currency
*         in: query
*         type: string
*       - name: status
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
                            "id": "5be241aa-cae0-469f-a3f3-487761e08647",
                            "member_id": "f56476cf-dff7-4d83-aaec-3e4f51a7f270",
                            "email": "huyht@blockchainlabs.asia",
                            "from_currency": "btc",
                            "to_currency": "eth",
                            "request_recipient_address": "0x95970e5869799a6d7b8efe5dc7bcbedd4b95b604",
                            "transaction_id": "55b1zqfu876wee9r",
                            "amount_expected_from": "1",
                            "amount_expected_to": "29.50313535",
                            "status": "WAITING",
                            "transaction_date": "2020-09-08T05:16:30.000Z",
                            "provider": "CHANGELLY",
                            "created_at": "2020-09-08T05:16:40.764Z",
                            "updated_at": "2020-09-08T09:52:30.836Z"
                        },
                        {
                            "id": "e39ef2a0-b6eb-4a7c-8a33-d689e42feb54",
                            "member_id": "f56476cf-dff7-4d83-aaec-3e4f51a7f270",
                            "email": "huyht@blockchainlabs.asia",
                            "from_currency": "btc",
                            "to_currency": "eth",
                            "request_recipient_address": "0x95970e5869799a6d7b8efe5dc7bcbedd4b95b604",
                            "transaction_id": "nsxpi126nesgfol4",
                            "amount_expected_from": "1",
                            "amount_expected_to": "29.59025355",
                            "status": "WAITING",
                            "transaction_date": "2020-09-08T05:10:30.000Z",
                            "provider": "CHANGELLY",
                            "created_at": "2020-09-08T05:10:35.135Z",
                            "updated_at": "2020-09-08T09:52:29.444Z"
                        }
                    ],
                    "limit": 2,
                    "offset": 0,
                    "total": 5
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
/* #end region */

router.get('/exchange-transactions/:id/details',
  authenticate,
  authority(PermissionKey.VIEW_EXCHANGE_TRANSACTION_DETAIL),
  controller.getDetail
);

/**
* @swagger
* /web/exchange-transactions/{id}/details:
*   get:
*     summary: Get exchange transaction detail
*     tags:
*       - Exchange
*     description:
*     parameters:
*       - name: id
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
                    "id": "a128c5cc-de2b-40e9-9081-81a643f186e2",
                    "member_id": "f9d2b181-33bb-4b71-a409-ebd565512c48",
                    "from_currency": "BNB",
                    "to_currency": "BTC",
                    "request_recipient_address": "bc1qvg24gyr8t6g9gawgrweaep2gk56haxnh3zpz6y",
                    "request_amount": null,
                    "request_extra_id": null,
                    "request_refund_address": "bnb1vldjw5jrtp27yla96yape52yy4k5g7ml2gs0ce",
                    "request_refund_extra_id": null,
                    "transaction_id": "usvcgoo2fsgmpxxi",
                    "provider_fee": "0.5",
                    "api_extra_fee": "0",
                    "payin_address": "bnb1z48pp6kvlcrqe8vcucqpggeh60ngxmzklkzfm0",
                    "payin_extra_id": "1128548167644070",
                    "payout_address": "bc1qvg24gyr8t6g9gawgrweaep2gk56haxnh3zpz6y",
                    "payout_extra_id": null,
                    "amount_expected_from": "3.00000000",
                    "amount_expected_to": "0.00764311",
                    "amount_to": "0.00764311",
                    "status": "EXPIRED",
                    "transaction_date": "2020-09-12T18:49:41.000Z",
                    "provider": "CHANGELLY",
                    "rate_id": "fe8993badf88c62f6c1e4d505d8a44b392f59d842e8023a9b3c601d627c1a3495d25573dedd0257af3408f61623ce7e01516ba8c03100bef6cc30d0b8765daf49fbac035851c27c5167b6859c62c6060",
                    "response": "{\"id\":\"usvcgoo2fsgmpxxi\",\"api_extra_fee\":\"0\",\"changelly_fee\":\"0.5\",\"payin_extra_id\":\"1128548167644070\",\"payout_extra_id\":null,\"refund_address\":\"bnb1vldjw5jrtp27yla96yape52yy4k5g7ml2gs0ce\",\"refund_extra_id\":\"\",\"amount_expected_from\":\"3.00000000\",\"amount_expected_to\":\"0.00764311\",\"amount_to\":\"0.00764311\",\"kyc_required\":false,\"pay_till\":\"2020-09-12T19:09:41.466Z\",\"status\":\"new\",\"currency_from\":\"bnb\",\"currency_to\":\"btc\",\"payin_address\":\"bnb1z48pp6kvlcrqe8vcucqpggeh60ngxmzklkzfm0\",\"payout_address\":\"bc1qvg24gyr8t6g9gawgrweaep2gk56haxnh3zpz6y\",\"created_at\":\"2020-09-12T18:49:41.000Z\"}",
                    "createdAt": "2020-09-12T18:49:41.629Z",
                    "updatedAt": "2020-09-14T03:54:17.991Z"
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
/* #end region */


router.get('/exchange-transactions/statuses',
  authenticate,
  controller.getStatuses
);

/**
* @swagger
* /web/exchange-transactions/statuses:
*   get:
*     summary: Get dropdown list exchange transaction status
*     tags:
*       - Exchange
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
                "data": [
                    {
                        "label": "NEW",
                        "value": "NEW"
                    },
                    {
                        "label": "WAITING",
                        "value": "WAITING"
                    },
                    {
                        "label": "CONFIRMING",
                        "value": "CONFIRMING"
                    },
                    {
                        "label": "EXCHANGING",
                        "value": "EXCHANGING"
                    },
                    {
                        "label": "SENDING",
                        "value": "SENDING"
                    },
                    {
                        "label": "FINISHED",
                        "value": "FINISHED"
                    },
                    {
                        "label": "FAILED",
                        "value": "FAILED"
                    },
                    {
                        "label": "REFUNDED",
                        "value": "REFUNDED"
                    },
                    {
                        "label": "EXPIRED",
                        "value": "EXPIRED"
                    },
                    {
                        "label": "OVERDUE",
                        "value": "OVERDUE"
                    },
                    {
                        "label": "HOLD",
                        "value": "HOLD"
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
/* #end region */

module.exports = router;
