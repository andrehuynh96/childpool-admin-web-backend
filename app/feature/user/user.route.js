const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const parseformdata = require('app/middleware/parse-formdata.middleware');
const { create, update, active } = require('./validator');
const controller = require('./user.controller');
const config = require('app/config')
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');

const router = express.Router();

router.get(
  '/users',
  authenticate,
  authority(PermissionKey.VIEW_LIST_USER),
  controller.search
);

router.get(
  '/users/:id',
  authenticate,
  authority(PermissionKey.VIEW_USER_DETAIL),
  controller.get
);

router.post(
  '/users',
  authenticate,
  authority(PermissionKey.CREATE_USER),
  validator(create),
  controller.create
);

router.put(
  '/users/:id',
  authenticate,
  authority(PermissionKey.UPDATE_USER),
  validator(update),
  controller.update
);

router.delete(
  '/users/:id',
  authenticate,
  authority(PermissionKey.DELETE_USER),
  controller.delete
);

router.post(
  '/active-user',
  validator(active),
  authenticate,
  authority(PermissionKey.ACTIVE_USER),
  controller.active
)

router.get(
  '/resend-email',
  authenticate,
  authority(PermissionKey.RESEND_EMAIL),
  controller.resendEmailActive
)

module.exports = router;




/*********************************************************************/


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
 *         format: int32UserRole
 *       - name: user_sts
 *         in: query
 *         type: string  UNACTIVATED|ACTIVATED|LOCKED
 *       - name: query
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
                          "id": 1,
                          "email":"example@gmail.com",
                          "twofa_enable_flg": true,
                          "create_at":"",
                          "user_sts":"ACTIVATED",
                          "role": ["Admin"]
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
                        "id": 1,
                        "email":"example@gmail.com",
                        "twofa_enable_flg": true,
                        "create_at":"",
                        "user_sts":"ACTIVATED",
                        "role_id":1
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


/*********************************************************************/

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
                          "role":1
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
                        "id": 1,
                        "email":"example@gmail.com",
                        "twofa_enable_flg": true,
                        "create_at":"",
                        "user_sts":"ACTIVATED",
                        "role":1
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
                          "email":"trinhdn@blockchainlabs.asia"
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
                        "id": 1,
                        "email":"example@gmail.com",
                        "twofa_enable_flg": true,
                        "create_at":"",
                        "user_sts":"ACTIVATED",
                        "role":1
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
 * /web/resend-email:
 *   get:
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