const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./currency.controller');
const router = express.Router();

router.get(
  '/currencies',
  authenticate,
  controller.get
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/currencies:
 *   get:
 *     summary: get currencies
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
                      id: 11,
                      symbol: "BCH",
                      name: "Bitcoin Cash",
                      icon: "https://static.chainservices.info/staking/platforms/bch.png",
                      platform: "BCH",
                      type: "NATIVE",
                      order_index: 9,
                      status: 1,
                      default_flg: false
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