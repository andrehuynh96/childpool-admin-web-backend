const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./nexo-transaction.controller');
const validator = require('app/middleware/validator.middleware');
const { search } = require('./validator');
const router = express.Router();

router.get('/nexo-transaction',
  authenticate,
  validator(search, 'query'),
  controller.search
);

router.get('/nexo-transaction/statuses',
  authenticate,
  controller.getNexoTxStatuses
);

router.get('/nexo-transaction/types',
  authenticate,
  controller.getNexoTxType
);
module.exports = router;



/** *******************************************************************/

/**
 * @swagger
 * /web/nexo-transaction:
 *   get:
 *     summary: search list transaction
 *     tags:
 *       - Nexo transaction
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
 *       - name: address
 *         in: query
 *         type: string
 *       - name: tx_id
 *         in: query
 *         type: string
 *       - name: status
 *         in: query
 *         type: string
 *       - name: type
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
* /web/nexo-transaction/statuses:
*   get:
*     summary: Get nexo statuses
*     tags:
*       - Currencies
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
      "value": "NEW",
      "label": "NEW"
    },
    {
      "value": "PENDING",
      "label": "PENDING"
    },
    {
      "value": "SUCCESS",
      "label": "SUCCESS"
    },
    {
      "value": "FAILED",
      "label": "FAILED"
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
* /web/nexo-transaction/types:
*   get:
*     summary: Get nexo statuses
*     tags:
*       - Currencies
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
    "value": "DEPOSIT",
    "label": "DEPOSIT"
  },
  {
    "value": "WITHDRAW",
    "label": "WITHDRAW"
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

