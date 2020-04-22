const express = require("express");
const controller = require("./permission.controller");
const authenticate = require('app/middleware/authenticate.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const route = express.Router();

route.get("/permissions",
  authenticate,
  authority(PermissionKey.VIEW_LIST_PERMISSION),
  controller.getAll
);
route.get("/me/permissions",
  authenticate,
 // authority(PermissionKey.VIEW_LIST_PERMISSION_DETAIL),
  controller.get
);

module.exports = route;


/*********************************************************************/
/**
* @swagger
* /web/permissions:
*   get:
*     summary: get list permission
*     tags:
*       - Permission
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
                "data": {
                    "items": [
                        {
                            "id": 4,
                            "name": "UPDATE_USER",
                            "description": "UPDATE_USER",
                            "deleted_flg": false,
                            "createdAt": "2020-02-12T10:10:37.797Z",
                            "updatedAt": "2020-02-12T10:10:37.797Z"
                        },
                        {
                            "id": 5,
                            "name": "DELETE_USER",
                            "description": "DELETE_USER",
                            "deleted_flg": false,
                            "createdAt": "2020-02-12T10:10:37.797Z",
                            "updatedAt": "2020-02-12T10:10:37.797Z"
                        },
                        {
                            "id": 6,
                            "name": "VIEW_LIST_USER",
                            "description": "VIEW_LIST_USER",
                            "deleted_flg": false,
                            "createdAt": "2020-02-12T10:10:37.797Z",
                            "updatedAt": "2020-02-12T10:10:37.797Z"
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
*
*/

/**
* @swagger
* /web/me/permissions:
*   get:
*     summary: get list permission of role
*     tags:
*       - Permission
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
                "data": {
                    "items": [
                        {
                            "id": 4,
                            "name": "UPDATE_USER",
                            "description": "UPDATE_USER",
                            "deleted_flg": false,
                            "createdAt": "2020-02-12T10:10:37.797Z",
                            "updatedAt": "2020-02-12T10:10:37.797Z"
                        },
                        {
                            "id": 5,
                            "name": "DELETE_USER",
                            "description": "DELETE_USER",
                            "deleted_flg": false,
                            "createdAt": "2020-02-12T10:10:37.797Z",
                            "updatedAt": "2020-02-12T10:10:37.797Z"
                        },
                        {
                            "id": 6,
                            "name": "VIEW_LIST_USER",
                            "description": "VIEW_LIST_USER",
                            "deleted_flg": false,
                            "createdAt": "2020-02-12T10:10:37.797Z",
                            "updatedAt": "2020-02-12T10:10:37.797Z"
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
*
*/