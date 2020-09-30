const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./staking-currency.controller');
const router = express.Router();

router.get(
	'/staking-currencies',
    authenticate,
	controller.getStakingPlatforms
);

module.exports = router;

/**
 * @swagger
 * /web/affiliate/staking-currencies:
 *   get:
 *     summary: get staking currency list
 *     tags:
 *       - Claim Request
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
                            "currency_symbol": "ATOM",
                            "name": "ATOM"
                        },
                        {
                            "currency_symbol": "IRIS",
                            "name": "IRIS"
                        },
                        {
                            "currency_symbol": "ONG",
                            "name": "ONG"
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
