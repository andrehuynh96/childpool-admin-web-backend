const express = require('express');
const validator = require("app/middleware/validator.middleware");
const { update } = require("./validator");
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./fiat-rate.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get(
  '/fiat-rate',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_VIEW_FIAT_RATE),
  controller.get
);

router.get(
  '/fiat-rate/histories',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_VIEW_FIAT_RATE),
  controller.getFiatRateHistories
);

router.put(
  '/fiat-rate',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_UPDATE_FIAT_RATE),
  validator(update),
  controller.update
);

module.exports = router;

/**
* @swagger
* /web/membership/fiat-rate:
*   get:
*     summary: Get Fiat rate
*     tags:
*       - Fiat rate
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data": {
                  "usd_rate_by_jpy": 107.483,
                  "usd_rate_by_jpy_updated_at": "2020/07/01"
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
* /web/membership/fiat-rate/histories:
*   get:
*     summary: Get Fiat rate histories
*     tags:
*       - Fiat rate
*     parameters:
*       - name: offset
*         in: query
*         type: integer
*         format: int32
*       - name: limit
*         in: query
*         type: integer
*         format: int32
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
                      "id": 14,
                      "rate": "1",
                      "currency_exchange": "USD/JPY",
                      "end_date": "2020-07-10T06:25:51.545Z",
                      "createdAt": "2020-07-10T06:22:57.755Z",
                      "updatedAt": "2020-07-10T06:25:53.369Z"
                    },
                    {
                      "id": 15,
                      "rate": "1",
                      "currency_exchange": "USD/JPY",
                      "end_date": null,
                      "createdAt": "2020-07-10T06:25:53.604Z",
                      "updatedAt": "2020-07-10T06:25:53.604Z"
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
* /web/membership/fiat-rate:
*   put:
*     summary: Update Fiat rate
*     tags:
*       - Fiat rate
*     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                      "data": true
                    }
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data": true
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
