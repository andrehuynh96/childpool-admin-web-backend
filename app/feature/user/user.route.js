const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const { create, update, active } = require('./validator');
const controller = require('./user.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const levelAuthority = require('app/middleware/level-authority.middleware');

const router = express.Router();

router.get(
  '/users',
  authenticate,
  authority(PermissionKey.VIEW_LIST_USER),
  controller.search
);

router.get(
  '/operator-countries',
  controller.getCountries
);

router.get(
  '/users/:id',
  authenticate,
  authority(PermissionKey.VIEW_USER_DETAIL),
  levelAuthority("req.params.id", true),
  controller.get
);

router.post(
  '/users',
  validator(create),
  authenticate,
  authority(PermissionKey.CREATE_USER),
  levelAuthority("req.body.role_id"),
  controller.create
);

router.put(
  '/users/:id',
  validator(update),
  authenticate,
  authority(PermissionKey.UPDATE_USER),
  levelAuthority("req.params.id", true),
  levelAuthority("req.body.role_id"),
  controller.update
);

router.delete(
  '/users/:id',
  authenticate,
  authority(PermissionKey.DELETE_USER),
  levelAuthority("req.params.id", true),
  controller.delete
);

router.post(
  '/active-user',
  validator(active),
  // authenticate,
  // authority(PermissionKey.ACTIVE_USER),
  controller.active
);

router.post(
  '/users/:id/resend-email',
  authenticate,
  authority(PermissionKey.RESEND_EMAIL),
  controller.resendEmailActive
);




module.exports = router;




/** *******************************************************************/


/**
 * @swagger
 * /web/users:
 *   get:
 *     summary: search user
 *     tags:
 *       - Users
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
 *       - name: name
 *         in: query
 *         type: string
 *       - name: email
 *         in: query
 *         type: string
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
                              "id": 21,
                              "email": "example@gmail.com",
                              "name": "bbbbb",
                              "twofa_enable_flg": false,
                              "user_sts": "ACTIVATED"
                          },
                          {
                              "id": 15,
                              "email": "hungtran.op1@gmail.com",
                              "twofa_enable_flg": false,
                              "user_sts": "ACTIVATED",
                              "latest_login_at": "2020-04-07T06:38:16.113Z"
                          }
                      ],
                      "offset": 0,
                      "limit": 2,
                      "total": 9
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




/** *******************************************************************/


/**
 * @swagger
 * /web/users/{id}:
 *   get:
 *     summary: get user by id
 *     tags:
 *       - Users
 *     description:
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                        "id": 21,
                        "email": "example@gmail.com",
                        "name": "bbbbb",
                        "twofa_enable_flg": false,
                        "user_sts": "ACTIVATED",
                        "role_id": 2
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


/** *******************************************************************/


/**
 * @swagger
 * /web/users/{id}:
 *   delete:
 *     summary: get user by id
 *     tags:
 *       - Users
 *     description:
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
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


/** *******************************************************************/

/**
 * @swagger
 * /web/users:
 *   post:
 *     summary: create user
 *     tags:
 *       - Users
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to register.
 *         schema:
 *            type: object
 *            example:
 *                  {
                          "email":"example@gmail.com",
                          "role_id":1,
                          "name":"aaaaa"
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
                        "id": 21,
                        "email": "example@gmail.com",
                        "name": "aaaaa",
                        "twofa_enable_flg": false,
                        "user_sts": "UNACTIVATED",
                        "role_id": 1
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


/** *******************************************************************/

/**
 * @swagger
 * /web/users/{id}:
 *   put:
 *     summary: update user
 *     tags:
 *       - Users
 *     description:
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to register.
 *         schema:
 *            type: object
 *            example:
 *                  {
                          "user_sts":"UNACTIVATED|ACTIVATED|LOCKED",
                          "role_id":1,
                          "name":"bbbbb"
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
                        "id": 21,
                        "email": "example@gmail.com",
                        "name": "bbbbb",
                        "twofa_enable_flg": false,
                        "user_sts": "ACTIVATED",
                        "role_id": 2
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

/**
* @swagger
* /web/active-user:
*   post:
*     summary: active registered user
*     tags:
*       - Users
*     description:
*     parameters:
*       - in: body
*         name: data
*         description: Data for activating.
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

/**
* @swagger
* /web/users/{id}/resend-email:
*   post:
*     summary: resend email contain active user link
*     tags:
*       - Users
*     description:
*     parameters:
*       - in: path
*         name: id
*         description: id of user who need activating
*         type: int
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
