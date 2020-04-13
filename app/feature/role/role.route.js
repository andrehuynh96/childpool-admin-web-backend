const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./role.controller');
const { create, update } = require("./validator");
const validator = require('app/middleware/validator.middleware');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.get(
  '/roles',
  authenticate,
  authority(Permission.VIEW_LIST_ROLE),
  controller.getAll
);


router.get(
  '/roles-have-permission',
  authenticate,
  authority(Permission.VIEW_LIST_ROLE),
  controller.roleHavePermission
);

router.get(
  '/roles/:id/permissions',
  authenticate,
  authority(Permission.VIEW_ROLE_PERMISSIONS),
  controller.permissionsOfRole
);

router.post("/roles",
  validator(create),
  authenticate,
  authority(Permission.CREATE_ROLE),
  controller.create
);

router.put("/roles/:id",
  validator(update),
  authenticate,
  authority(Permission.UPDATE_ROLE),
  controller.update
);

module.exports = router;



/*********************************************************************/


/**
 * @swagger
 * /web/roles:
 *   get:
 *     summary: get role
 *     tags:
 *       - Roles
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
 *                 "data":[
                      {
                        "id":1,
                        "name":"Admin",
                        "description":null,
                        "deleted_flg":false,
                        "createdAt":"2020-01-16T07:17:26.158Z",
                        "updatedAt":"2020-01-16T07:17:26.158Z"
                      }
                    ]
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
 * /web/roles-have-permission:
 *   get:
 *     summary: get roles that user have permission CURD
 *     tags:
 *       - Roles
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
 *                 "data":[
                      {
                        "id":1,
                        "name":"Admin",
                        "description":null,
                        "deleted_flg":false,
                        "createdAt":"2020-01-16T07:17:26.158Z",
                        "updatedAt":"2020-01-16T07:17:26.158Z"
                      }
                    ]
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
 * /web/roles/{id}/permissions:
 *   get:
 *     summary: get permission of role
 *     tags:
 *       - Roles
 *     description:
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 * 
 *           application/json:
 *             {
                  "data": [
                      {
                          "id": 160,
                          "name": "VIEW_LIST_USER",
                          "description": "VIEW_LIST_USER",
                          "deleted_flg": false,
                          "createdAt": "2020-04-09T04:09:06.904Z",
                          "updatedAt": "2020-04-09T04:09:06.904Z"
                      },
                      {
                          "id": 161,
                          "name": "VIEW_USER",
                          "description": "VIEW_USER",
                          "deleted_flg": false,
                          "createdAt": "2020-04-09T04:09:06.904Z",
                          "updatedAt": "2020-04-09T04:09:06.904Z"
                      },
                      {
                          "id": 162,
                          "name": "ACTIVE_USER",
                          "description": "ACTIVE_USER",
                          "deleted_flg": false,
                          "createdAt": "2020-04-09T04:09:06.904Z",
                          "updatedAt": "2020-04-09T04:09:06.904Z"
                      },
                      {
                          "id": 163,
                          "name": "VIEW_ACCOUNT",
                          "description": "VIEW_ACCOUNT",
                          "deleted_flg": false,
                          "createdAt": "2020-04-09T04:09:06.904Z",
                          "updatedAt": "2020-04-09T04:09:06.904Z"
                      }
                    ]
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
* /web/roles:
*   post:
*     summary: create role
*     tags:
*       - Roles
*     description:
*     parameters:
*       - in: body
*         name: name
*         type: string
*         required: true
*       - in: body
*         name: level
*         type: string
*         required: true
*       - in: body
*         name: permission_ids
*         type: array
*         required: true
*         schema:
*            type: object
*            required:
*            - name
*            - level
*            - permission_ids
*            example:
*               {
                    "name":"User",
                    "level": 50,
                    "permission_ids":[17,18,19,20]
                  }
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                  "data": {
                      "role_permissions": [
                          {
                              "role_id": 15,
                              "permission_id": 17
                          },
                          {
                              "role_id": 15,
                              "permission_id": 18
                          },
                          {
                              "role_id": 15,
                              "permission_id": 19
                          },
                          {
                              "role_id": 15,
                              "permission_id": 20
                          }
                      ]
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
* /web/roles/{id}:
*   put:
*     summary: update role
*     tags:
*       - Roles
*     description:
*     parameters:
*       - in: path
*         name: id
*         type: string
*         required: true
*       - in: body
*         name: name
*         type: string
*         required: true
*       - in: body
*         name: level
*         type: string
*         required: true
*       - in: body
*         name: permission_ids
*         type: array
*         required: true
*         schema:
*            type: object
*            required:
*            - name
*            - level
*            - permission_ids
*            example:
*               {
                    "name":"User1",
                    "level": 50,
                    "permission_ids":[17,18]
                  }
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                  "data": true
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