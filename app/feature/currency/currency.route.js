const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./currency.controller');
const validator = require('app/middleware/validator.middleware');
const { search, update } = require('./validator');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get(
  '/currencies',
  authenticate,
  authority(PermissionKey.VIEW_LIST_CURRENCY),
  validator(search,'query'),
  controller.search
);

router.get('/currencies/statuses',
  authenticate,
  controller.getCurrencyStatuses
);

router.get('/currencies/platforms',
  authenticate,
  controller.getPlatforms
);

router.get(
  '/currencies/:currencyId',
  authenticate,
  authority(PermissionKey.VIEW_CURRENCY_DETAIL),
  controller.getDetails
);

router.put(
  '/currencies/:currencyId',
  authenticate,
  authority(PermissionKey.UPDATE_CURRENCY_DETAIL),
  validator(update),
  controller.update
);

module.exports = router;

/** *******************************************************************/

/**
 * @swagger
 * /web/currencies:
 *   get:
 *     summary: search currencies
 *     tags:
 *       - Currencies
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
 *       - name: symbol
 *         in: query
 *         type: string
 *       - name: status
 *         in: query
 *         type: integer
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
                            "id": 2,
                            "symbol": "ETH",
                            "name": "Ethereum",
                            "icon": "https://static.chainservices.info/staking/platforms/eth.png",
                            "sc_token_address": null,
                            "decimals": 18,
                            "platform": "ETH",
                            "description": null,
                            "type": "NATIVE",
                            "order_index": 1,
                            "status": "ENABLED",
                            "created_by": 0,
                            "updated_by": 0,
                            "default_flg": true,
                            "explore_url": null,
                            "transaction_format_link": null,
                            "address_format_link": null,
                            "createdAt": "2020-02-27T07:58:29.300Z",
                            "updatedAt": "2020-02-27T07:58:29.300Z"
                        }
                    ],
                    "offset": 0,
                    "limit": 1,
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
* /web/currencies/statuses:
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

/**
* @swagger
* /web/currencies/:currencyId:
*   get:
*     summary: Get currency details
*     tags:
*       - Exchange
*     description:
*     parameters:
*       - name: currencyId
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
                      "status": "ENABLE",
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
