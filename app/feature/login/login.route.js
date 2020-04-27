const express = require('express');
const config = require('app/config')
const verifyRecaptcha = require('app/middleware/verify-recaptcha.middleware');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./login.request-schema');
const controller = require('./login.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(config.recaptchaSiteKey, config.recaptchaSecret);
const router = express.Router();

router.post(
  '/login',
  validator(requestSchema),
  recaptcha.middleware.verify,
  verifyRecaptcha,
  controller.login
);
router.get(
  '/login/me',
  authenticate,
  controller.getPartner
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
 *                 "data":{
                      "confirm_ip":true,
                      "twofa":true,
                      "verify_token":"3f76680510bcca07e7e011dcc1effb079d1d0a34",
                      "user":{
                        "id": 1,
                        "email":"example@gmail.com",
                        "twofa_enable_flg": true,
                        "create_at":"",
                        "user_sts":"ACTIVATED",
                        "latest_login_at":"2020-02-11T16:03:09.497Z"
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

 /*********************************************************************/
/**
 * @swagger
 * /web/login/me:
 *   get:
 *     summary: get partner info
 *     tags:
 *       - Login
 *     description: get partner info
 *     parameters:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                    "data": {
                        "id": "ed483de6-2d14-11ea-978f-2e728ce88125",
                        "email": "phith1@blockchainlabs.asia",
                        "name": "Infinito",
                        "parent_id": "ed483de6-2d14-11ea-978f-2e728ce88125",
                        "partner_type": "CHILD",
                        "actived_flg": true,
                        "deleted_flg": false,
                        "created_by": 0,
                        "updated_by": 73,
                        "createdAt": "2020-03-05T11:22:04.602Z",
                        "updatedAt": "2020-03-30T08:50:24.064Z"
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