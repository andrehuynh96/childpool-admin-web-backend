const express = require('express');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./confirm-2fa.request-schema');
const controller = require('./confirm-2fa.controller');

const router = express.Router();

router.post(
  '/confirm-2fa',
  validator(requestSchema),
  controller
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/confirm-2fa:
 *   post:
 *     summary: Confirm 2fa
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for Confirm 2fa.
 *         schema:
 *            type: object
 *            required:
 *            - verify_token
 *            - password
 *            example:
 *               {
                        "verify_token":"3f76680510bcca07e7e011dcc1effb079d1d0a34",
                        "twofa_code":"123456"
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":{
                        "id": 1,
                        "email":"example@gmail.com",
                        "twofa_enable_flg": true,
                        "create_at":"",
                        "user_sts":"ACTIVATED"
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