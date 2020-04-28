const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const parseformdata = require('app/middleware/parse-formdata.middleware');
const { changePassword, update, twofa, updateProfile } = require('./validator');
const controller = require('./account.controller');
const verifyRecaptcha = require('app/middleware/verify-recaptcha.middleware');
const config = require('app/config')
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(config.recaptchaSiteKey, config.recaptchaSecret);
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get(
  '/me',
  authenticate,
  authority(PermissionKey.VIEW_USER),
  controller.getMe
);

router.post(
  '/me/change-password',
  authenticate,
  authority(PermissionKey.CHANGE_PASSWORD_ACCOUNT),
  validator(changePassword),
  recaptcha.middleware.verify,
  verifyRecaptcha,
  controller.changePassword
);
router.get(
  '/me/login-history',
  authenticate,
  authority(PermissionKey.VIEW_LOGIN_HISTORY_ACCOUNT),
  controller.loginHistory
);

router.get(
  '/me/2fa',
  authenticate,
  authority(PermissionKey.VIEW_2FA_ACCOUNT),
  controller.get2Fa
);

router.post(
  '/me/2fa',
  authenticate,
  authority(PermissionKey.UPDATE_2FA_ACCOUNT),
  validator(twofa),
  controller.update2Fa
);

router.put(
  '/me/profile',
  authenticate,
  authority(PermissionKey.UPDATE_PROFILE_ACCOUNT),
  validator(updateProfile),
  controller.updateProfile
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/me:
 *   get:
 *     summary: get proflie
 *     tags:
 *       - Accounts
 *     description:
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
                      "id": 32,
                      "email": "myhn@blockchainlabs.asia",
                      "name": "Cuong Nguyen",
                      "twofa_enable_flg": false,
                      "user_sts": "ACTIVATED",
                      "latest_login_at": "2020-04-28T04:04:26.642Z",
                      "partner": {
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
 * /web/me/change-password:
 *   post:
 *     summary: change password
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to register.
 *         schema:
 *            type: object
 *            required:
 *            - password
 *            - new_password
  *            properties:
 *              password:
 *                type: string
 *              new_password:
 *                type: string
 *            example:
 *                  {
                          "password":"Abc123456",
                          "new_password":"123Abc123456",
                          "g-recaptcha-response":"fdsfdsjkljfsdfjdsfdhs"
 *                  }
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
/*********************************************************************/

/**
 * @swagger
 * /web/me/2fa:
 *   get:
 *     summary: get secret twofa
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":"LNPGW5ZSIFUECJCBJ5OXWIKFERYEK6BDKZSHIL2YERDDUXSKKYSQ"
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
 * /web/me/2fa:
 *   post:
 *     summary: update 2fa
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to register.
 *         schema:
 *            type: object
 *            required:
 *            - disable
 *            - twofa_code
  *            properties:
 *              twofa_secret:
 *                type: string
 *              twofa_code:
 *                type: string
 *              disable:
 *                type: boolean
 *            example:
 *                  {
                          "twofa_secret":"AIU45sdsahssdsjYUDHd6",
                          "twofa_code":"123456",
                          "disable":false
 *                  }
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



/*********************************************************************/
/**
 * @swagger
 * /web/me/login-history:
 *   get:
 *     summary: search login-history
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                      "items": [
                        {
                          "user_id":1,
                          "client_ip":"192.168.0.1",
                          "action":"LOGIN",
                          "user_agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                          "data":"",
                          "createdAt":"2020-01-13T06:47:41.248Z",
                          "updatedAt":"2020-01-13T06:47:41.248Z"
                        }
                      ],
                      "offset": 0,
                      "limit": 10,
                      "total": 4
 *                 }
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
 * /web/me/profile:
 *   put:
 *     summary: update user profile
 *     tags:
 *       - Accounts
 *     description: update user profile
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to update.
 *         schema:
 *            type: object
 *            required:
 *            - name
 *            - twofa_code
  *            properties:
 *              name:
 *                type: string
 *            example:
 *                  {
                        "name": "testttttttttt"
 *                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                        "id": 10,
                        "email": "trinhdn@blockchainlabs.asia",
                        "name": "testttttttttt",
                        "twofa_enable_flg": false,
                        "user_sts": "ACTIVATED",
                        "latest_login_at": "2020-04-21T10:58:38.843Z"
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