const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const controller = require('./notification.controller');
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
router.get('/notifications',
  validator(search, 'query'),
  authenticate,
  authority(PermissionKey.VIEW_NOTIFICATIONS),
  controller.search
);

/**
* @swagger
* /web/notifications:
*   get:
*     summary: Search exchange currencies
*     tags:
*       - Notification
*     description: "Required permission: VIEW_NOTIFICATIONS."
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

/* #region Get notification types*/
router.get('/notifications/types',
  authenticate,
  controller.getNotificationTypes
);

/**
* @swagger
* /web/notifications/statuses:
*   get:
*     summary: Get notification statuses
*     tags:
*       - Notification
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

/* #region Get notification details */
router.get('/notifications/:exchangeCurrencyId',
  validator(exchangeCurrencyIdParam, 'params'),
  authenticate,
  authority(PermissionKey.VIEW_NOTIFICATIONS),
  controller.getDetails
);

/**
* @swagger
* /web/notifications/:exchangeCurrencyId:
*   get:
*     summary: Get notification details
*     tags:
*       - Notification
*     description: "Required permission: VIEW_NOTIFICATIONS."
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

/* #region Create notification */
router.post('/notifications/',
  validator(create, 'body'),
  authenticate,
  authority(PermissionKey.CREATE_NOTIFICATION),
  controller.create
);

/**
* @swagger
* /web/notifications:
*   post:
*     summary: Create notification
*     tags:
*       - Notification
*     description: "Required permission: CREATE_NOTIFICATION."
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

/* #region Update notification */
router.put('/notifications/:exchangeCurrencyId',
  validator(exchangeCurrencyIdParam, 'params'),
  validator(update, 'body'),
  authenticate,
  authority(PermissionKey.UPDATE_NOTIFICATION),
  controller.update
);

/**
* @swagger
* /web/notifications/:exchangeCurrencyId:
*   put:
*     summary: Update notification
*     tags:
*       - Notification
*     description: "Required permission: UPDATE_NOTIFICATION."
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
