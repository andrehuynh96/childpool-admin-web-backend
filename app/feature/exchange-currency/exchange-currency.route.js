const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const controller = require('./exchange-currency.controller');
const validator = require('app/middleware/validator.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const {
  search,
  exchangeCurrencyIdParam,
  update,
  create,
} = require('./validator');

const router = express.Router();

/* #region Search exchange currencies */
router.get('/exchange-currencies',
  validator(search, 'query'),
  authenticate,
  authority(PermissionKey.VIEW_EXCHANGE_CURRENCIES),
  controller.search
);

/**
* @swagger
* /web/exchange-currencies:
*   get:
*     summary: Search exchange currencies
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
*       - name: name
*         in: query
*         type: string
*       - name: platform
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
                            "id": 3,
                            "symbol": "ETH",
                            "platform": "ETH",
                            "name": "Ethereum",
                            "icon": "https://web-api.changelly.com/api/coins/eth.png",
                            "order_index": 0,
                            "status": 1,
                            "from_flg": true,
                            "to_flg": true,
                            "fix_rate_flg": true,
                            "created_at": "2020-09-04T07:27:17.601Z",
                            "updated_at": "2020-09-04T07:27:17.601Z"
                        },
                        {
                            "id": 4,
                            "symbol": "XEM",
                            "platform": "XEM",
                            "name": "NEM",
                            "icon": "https://web-api.changelly.com/api/coins/xem.png",
                            "order_index": 0,
                            "status": 1,
                            "from_flg": true,
                            "to_flg": true,
                            "fix_rate_flg": true,
                            "created_at": "2020-09-04T07:27:17.601Z",
                            "updated_at": "2020-09-04T07:27:17.601Z"
                        }
                    ],
                    "offset": 0,
                    "limit": 10,
                    "total": 6
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

/* #region Get exchange currency statuses */
router.get('/exchange-currencies/statuses',
  authenticate,
  controller.getExchangeCurrencyStatuses
);

/**
* @swagger
* /web/exchange-currencies/statuses:
*   get:
*     summary: Get exchange currency statuses
*     tags:
*       - Exchange
*     description:
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
                        "value": -1,
                        "label": "DISABLED"
                    },
                    {
                        "value": 1,
                        "label": "ENABLED"
                    },
                    {
                        "value": 0,
                        "label": "COMMING_SOON"
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

/* #region Get platform of currencies */
router.get('/exchange-currencies/platforms',
  authenticate,
  controller.getPlatforms
);

/**
* @swagger
* /web/exchange-currencies/platforms:
*   get:
*     summary: Get platform of currencies
*     tags:
*       - Exchange
*     description:
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
                      "id": 2,
                      "symbol": "BTC",
                      "platform": "BTC",
                      "name": "Bitcoin",
                      "icon": "https://web-api.changelly.com/api/coins/btc.png",
                      "order_index": 0,
                      "status": 1,
                      "from_flg": true,
                      "to_flg": true,
                      "fix_rate_flg": true,
                      "created_at": "2020-09-04T07:27:17.601Z",
                      "updated_at": "2020-09-04T07:27:17.601Z"
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

/* #region Get exchange currency details */
router.get('/exchange-currencies/:exchangeCurrencyId',
  validator(exchangeCurrencyIdParam, 'params'),
  authenticate,
  authority(PermissionKey.UPDATE_EXCHANGE_CURRENCY),
  controller.getDetails
);

/**
* @swagger
* /web/exchange-currencies/:exchangeCurrencyId:
*   get:
*     summary: Get exchange currency details
*     tags:
*       - Exchange
*     description:
*     parameters:
*       - name: exchangeCurrencyId
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
                "data": [
                    {
                      "id": 2,
                      "symbol": "BTC",
                      "platform": "BTC",
                      "name": "Bitcoin",
                      "icon": "https://web-api.changelly.com/api/coins/btc.png",
                      "order_index": 0,
                      "status": 1,
                      "from_flg": true,
                      "to_flg": true,
                      "fix_rate_flg": true,
                      "created_at": "2020-09-04T07:27:17.601Z",
                      "updated_at": "2020-09-04T07:27:17.601Z"
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

/* #region Create exchange currency */
router.post('/exchange-currencies/',
  validator(create, 'body'),
  authenticate,
  authority(PermissionKey.CREATE_EXCHANGE_CURRENCY),
  controller.create
);

/**
* @swagger
* /web/exchange-currencies:
*   post:
*     summary: Create exchange currency
*     tags:
*       - Exchange
*     description:
*     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                      "symbol": "BTC",
                      "platform": "BTC",
                      "name": "Bitcoin",
                      "icon": "https://web-api.changelly.com/api/coins/btc.png",
                      "order_index": 10,
                      "status": 1,
                      "from_flg": true,
                      "to_flg": true,
                      "fix_rate_flg": true
*                  }
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
                      "id": 2,
                      "symbol": "BTC",
                      "platform": "BTC",
                      "name": "Bitcoin",
                      "icon": "https://web-api.changelly.com/api/coins/btc.png",
                      "order_index": 0,
                      "status": 1,
                      "from_flg": true,
                      "to_flg": true,
                      "fix_rate_flg": true,
                      "created_at": "2020-09-04T07:27:17.601Z",
                      "updated_at": "2020-09-04T07:27:17.601Z"
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

/* #region Update exchange currency */
router.put('/exchange-currencies/:exchangeCurrencyId',
  validator(exchangeCurrencyIdParam, 'params'),
  validator(update, 'body'),
  authenticate,
  authority(PermissionKey.UPDATE_EXCHANGE_CURRENCY),
  controller.update
);

/**
* @swagger
* /web/exchange-currencies/:exchangeCurrencyId:
*   put:
*     summary: Update exchange currency
*     tags:
*       - Exchange
*     description:
*     parameters:
*       - name: exchangeCurrencyId
*         in: path
*         type: string
*         required: true
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                      "symbol": "BTC",
                      "platform": "BTC",
                      "name": "Bitcoin",
                      "icon": "https://web-api.changelly.com/api/coins/btc.png",
                      "order_index": 10,
                      "status": 1,
                      "from_flg": true,
                      "to_flg": true,
                      "fix_rate_flg": true
*                  }
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
                      "id": 2,
                      "symbol": "BTC",
                      "platform": "BTC",
                      "name": "Bitcoin",
                      "icon": "https://web-api.changelly.com/api/coins/btc.png",
                      "order_index": 0,
                      "status": 1,
                      "from_flg": true,
                      "to_flg": true,
                      "fix_rate_flg": true,
                      "created_at": "2020-09-04T07:27:17.601Z",
                      "updated_at": "2020-09-04T07:27:17.601Z"
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

module.exports = router;
