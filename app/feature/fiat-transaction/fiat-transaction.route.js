const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const controller = require('./fiat-transaction.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./fiat-transaction.request-schema');
const router = express.Router();

/* #region Search fiat transaction */

router.get('/fiat-transactions',
  authenticate,
  authority(PermissionKey.VIEW_LIST_FIAT_TRANSACTION),
  validator(requestSchema, 'query'),
  controller.search
);

/**
* @swagger
* /web/fiat-transactions:
*   get:
*     summary: Search fiat transactions
*     tags:
*       - Fiat Transaction
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
*       - name: to_cryptocurrency
*         in: query
*         type: string
*       - name: status
*         in: query
*         type: string
*       - name: payment_method
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
                            "id": "e7eeefa2-7f01-4b12-9895-74fd6fa9c4ee",
                            "member_id": "a5edcce6-c8c9-448c-a903-4806668b3c7a",
                            "email": "thangdv@blockchainlabs.asia",
                            "from_currency": "USD",
                            "to_cryptocurrency": "BTC",
                            "payment_method": "debit-card",
                            "from_amount": "1",
                            "status": "NEW",
                            "provider": "SENDWYRE",
                            "created_at": "2020-10-30T09:04:58.552Z",
                            "updated_at": "2020-10-30T09:04:58.552Z"
                        },
                        {
                            "id": "c593e4aa-377d-4db3-9e98-6e03753a11b6",
                            "member_id": "a5edcce6-c8c9-448c-a903-4806668b3c7a",
                            "email": "thangdv@blockchainlabs.asia",
                            "from_currency": "USD",
                            "to_cryptocurrency": "BTC",
                            "payment_method": "debit-card",
                            "payment_method_name": "Visa ending 1111",
                            "transaction_id": "TF_CRDXC3WBEWH",
                            "from_amount": "6.69",
                            "to_amount": "0.00007265",
                            "status": "COMPLETE",
                            "provider": "SENDWYRE",
                            "created_at": "2020-10-30T08:20:05.470Z",
                            "updated_at": "2020-10-30T10:28:03.322Z"
                        }
                    ],
                    "limit": 2,
                    "offset": 0,
                    "total": 11
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
/* #endregion */


/* #region Get fiat transaction status */
router.get('/fiat-transactions/statuses',
  authenticate,
  controller.getStatuses
);

/**
* @swagger
* /web/fiat-transactions/statuses:
*   get:
*     summary: Get dropdown list fiat transaction status
*     tags:
*       - Fiat Transaction
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
                        "label": "RUNNING_CHECKS",
                        "value": "RUNNING_CHECKS"
                    },
                    {
                        "label": "PROCESSING",
                        "value": "PROCESSING"
                    },
                    {
                        "label": "COMPLETE",
                        "value": "COMPLETE"
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
/* #end region */

/* #region Fiat transaction payment methods */
router.get('/fiat-transactions/payment-methods',
  authenticate,
  controller.getPaymentMethods
);
/**
* @swagger
* /web/fiat-transactions/payment methods:
*   get:
*     summary: Get dropdown list fiat transaction payment methods
*     tags:
*       - Fiat Transaction
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
                        "label": "DEBIT_CARD",
                        "value": "debit-card"
                    },
                    {
                        "label": "APPLE_PAY",
                        "value": "apple-pay"
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
/* #endregion */

/* #region Export fiat transaction csv */
router.get('/fiat-transactions/download-csv',
  authenticate,
  authority(PermissionKey.EXPORT_FIAT_TRANSACTION_CSV),
  validator(requestSchema, 'query'),
  controller.downloadCSV
);

/**
* @swagger
* /web/fiat-transactions/download-csv:
*   get:
*     summary: export fiat transactions csv
*     tags:
*       - Fiat Transaction
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
*       - name: to_cryptocurrency
*         in: query
*         type: string
*       - name: status
*         in: query
*         type: string
*       - name: payment_method
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
                "data": {}
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
/* #endregion */

/* #region Get fiat transaction detail */
router.get('/fiat-transactions/:id/details',
  authenticate,
  authority(PermissionKey.VIEW_FIAT_TRANSACTION_DETAIL),
  controller.getDetails
);

/**
* @swagger
* /web/fiat-transactions/{id}/details:
*   get:
*     summary: Get fiat transaction detail
*     tags:
*       - Fiat Transaction
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
                    "id": "5657e264-7e54-468b-b986-b7c77f60631d",
                    "member_id": "a5edcce6-c8c9-448c-a903-4806668b3c7a",
                    "from_currency": "USD",
                    "to_cryptocurrency": "BTC",
                    "payment_method": "debit-card",
                    "payment_method_name": null,
                    "from_amount": null,
                    "to_amount": null,
                    "to_address": "moTXHK5dfgT62Y8XMM6RxRAVV8ojmofAnR",
                    "payment_url": "https://pay.testwyre.com/purchase?accountId=AC_DHXCZZNCJ29&failureRedirectUrl=https%3A%2F%2Fwww.google.com&amount=1&redirectUrl=https%3A%2F%2Fwww.google.com&phone&destCurrency=BTC&paymentMethod=debit-card&reservation=LTEN743B4W2UZQ8FVBVT&sourceCurrency=USD&dest=moTXHK5dfgT62Y8XMM6RxRAVV8ojmofAnR&email=thangdv%40blockchainlabs.asia",
                    "reservation": "LTEN743B4W2UZQ8FVBVT",
                    "redirect_url": null,
                    "failure_redirect_url": null,
                    "rate": "0",
                    "fee_currency": "0",
                    "total_fee": "0",
                    "fee_from": "0",
                    "fee_to": "0",
                    "fees": null,
                    "order_id": null,
                    "order_type": null,
                    "transaction_id": null,
                    "tx_id": null,
                    "transaction_status": null,
                    "status": "NEW",
                    "provider": "SENDWYRE",
                    "message": null,
                    "response": null,
                    "device_code": null,
                    "createdAt": "2020-10-30T04:12:00.612Z",
                    "updatedAt": "2020-10-30T04:12:00.612Z"
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
/* #endregion */

module.exports = router;
