const express = require('express');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./set-new-password.request-schema');
const controller = require('./set-new-password.controller');

const router = express.Router();

router.post(
  '/set-new-password',
  validator(requestSchema),
  controller
);

module.exports = router;




/*********************************************************************/

/**
 * @swagger
 * /web/set-new-password:
 *   post:
 *     summary: set new password
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
 *            - password
 *            example:
 *               {
                        "verify_token":"3f76680510bcca07e7e011dcc1effb079d1d0a34",
                        "password":"Abc@123456",
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