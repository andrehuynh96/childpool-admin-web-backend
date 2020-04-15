const express = require('express');
const controller = require('./confirm-ip.controller');
const requestSchema = require('./confirm-ip.request-schema');
const validator = require('app/middleware/validator.middleware');
const router = express.Router();

router.post(
    '/confirm-ip',
    validator(requestSchema),
    controller
  );
module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/confirm-ip:
 *   post:
 *     summary: confirm-ip
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for login.
 *         schema:
 *            type: object
 *            required:
 *            - verify_token
 *            example:
 *               {
                        "verify_token":"ZmU0MTAxYzQtYjA3NS00ZmFlLTgzMmMtYTI0Yzc0ZmViMTY2"
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": true
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