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


router.get('/exchange-transactions/statuses',
  authenticate,
  controller.getStatus
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
