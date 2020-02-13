const express = require('express');
const config = require('app/config');
const verifyRecaptcha = require('app/middleware/verify-recaptcha.middleware');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./forgot-password.request-schema');
const controller = require('./forgot-password.controller');

const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(config.recaptchaSiteKey, config.recaptchaSecret);
const router = express.Router();

router.post(
  '/forgot-password',
  validator(requestSchema),
  recaptcha.middleware.verify,
  verifyRecaptcha,
  controller
);

module.exports = router;




/*********************************************************************/

/**
 * @swagger
 * /web/forgot-password:
 *   post:
 *     summary: forgot password
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
 *            - g-recaptcha-response
 *            - email
 *            example:
 *               {
                        "g-recaptcha-response":"3f76680510bcca07e7e011dcc1effb079d1d0a34",
                        "email":"example@gmail.com",
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