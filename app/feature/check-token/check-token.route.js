const express = require('express');
const controller = require('./check-token.controller');

const router = express.Router();

router.get(
  '/check-token/:token',
  controller
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/check-token/{token}:
 *   get:
 *     summary: check token
 *     tags:
 *       - Token
 *     description:
 *     parameters:
 *       - in: path
 *         name: token
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
 *                 "data":{
                        "token_sts":"VALID|EXPIRED|USED",
                        "user_sts":"ACTIVATED|UNACTIVATED|LOCKED"
                    }
 *             }
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