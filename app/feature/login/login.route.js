const express = require('express');
const config = require('app/config')
const verifyRecaptcha = require('app/middleware/verify-recaptcha.middleware');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./login.request-schema');
const controller = require('./login.controller');

const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(config.recaptchaSiteKey, config.recaptchaSecret);
const router = express.Router();

router.post(
  '/login',
  validator(requestSchema),
  recaptcha.middleware.verify,
  verifyRecaptcha,
  controller
);
module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/login:
 *   post:
 *     summary: Login
 *     tags:
 *       - Accounts
 *     description: if twofa == true then return verify_token otherwise return user object, if need to verify IP then return confirm_ip
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for login.
 *         schema:
 *            type: object
 *            required:
 *            - g-recaptcha-response
 *            - email
 *            - password
 *            example:
 *               {
                        "g-recaptcha-response":"3f76680510bcca07e7e011dcc1effb079d1d0a34",
                        "email":"example@gmail.com",
                        "password":"Abc@123456"
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                        "confirm_ip": false,
                        "twofa": false,
                        "user": {
                            "id": 10,
                            "email": "trinhdn@blockchainlabs.asia",
                            "twofa_enable_flg": false,
                            "user_sts": "ACTIVATED",
                            "latest_login_at": "2020-04-07T22:47:02.796Z",
                            "roles": [
                                {
                                    "id": 1,
                                    "name": "Master",
                                    "level": 0,
                                    "root_flg": true
                                },
                                {
                                    "id": 2,
                                    "name": "Admin",
                                    "level": 10,
                                    "root_flg": false
                                }
                            ]
                        }
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