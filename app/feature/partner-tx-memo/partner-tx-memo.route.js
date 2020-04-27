const express = require("express");
const controller = require("./partner-tx-memo.controller");
const { create } = require("./validator");
const validator = require("app/middleware/validator.middleware");
const authenticate = require('app/middleware/authenticate.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get(
    '/partners/:partner_id/memos',
    authenticate,
    authority(PermissionKey.VIEW_LIST_PARTNER_TX_MEMO),
    controller.getAll
);

router.post(
    '/partners/:partner_id/memos',
    validator(create),
    authenticate,
    authority(PermissionKey.CREATE_PARTNER_TX_MEMO),
    controller.create
);
router.get(
    '/partners/:partner_id/memos/histories',
    authenticate,
    authority(PermissionKey.VIEW_LIST_PARTNER_TX_MEMO_HISTORY),
    controller.getHis
);
module.exports = router;

/**
 * @swagger
 * /web/partners/{partner_id}/memos:
 *   get:
 *     summary: get list partner memo
 *     tags:
 *       - Memo
 *     description: get list partner memo
 *     parameters:
 *       - name: partner_id
 *         in: path
 *         type: string
 *         required: true
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
 *            {
                "data": {
                    "items": [
                        {
                            "id": "6a547aac-76ba-450f-acbe-0e25d5d293c1",
                            "platform": "ATOM",
                            "memo": "BINARY:ATOM",
                            "default_flg": true,
                            "updated_by": 71,
                            "updated_at": "2020-03-30T07:21:06.420Z",
                            "updated_by_user_name": "Myhn"
                        },
                        {
                            "id": "9d284127-3e71-4d41-9b61-f48d0910877e",
                            "platform": "IRIS",
                            "memo": "Infinitooo:IRIS",
                            "default_flg": true,
                            "updated_by": 71,
                            "updated_at": "2020-03-30T07:16:36.928Z",
                            "updated_by_user_name": "Myhn"
                        },
                        {
                            "id": "e71887da-8d24-4c56-b8ed-3ca0fec9719c",
                            "platform": "IRIS",
                            "memo": "Infinito:IRISs",
                            "default_flg": true,
                            "updated_by": 71,
                            "updated_at": "2020-03-30T07:20:57.111Z",
                            "updated_by_user_name": "Hung"
                        }
                    ],
                    "offset": 0,
                    "limit": 10,
                    "total": 3
                }
            }
 *             
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
 * /web/partners/{partner_id}/memos:
 *   post:
 *     summary: create and update list partner memo
 *     tags:
 *       - Memo
 *     description: create and update list partner memo
 *     parameters:
 *       - in: path
 *         name: partner_id
 *         type: string
 *         required: true  
 *       - in: body
 *         name: data
 *         description: Data for Partner.
 *         schema:
 *            type: array
 *            example:
 *               {
                    "items": [
                      { "platform": "ATOM",
                        "memo": "Infinito:ATOM TEST"
                      },
                      { "platform": "ATOM",
                        "memo": "BINARY:ATOM TEST"
                      }
                    ],
                    "user_id": 115
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *            {
                "data": {
                    "items": [
                        {
                            "id": "53861af9-f058-4f2a-9b5a-409f11607019",
                            "platform": "ATOM",
                            "memo": "Infinito:ATOM TEST",
                            "default_flg": true,
                            "updated_by": 115,
                            "updated_at": "2020-04-13T09:05:47.640Z",
                            "partner_updated_by": "53861af9-f058-4f2a-9b5a-409f11607019"
                        },
                        {
                            "id": "064445b1-c9be-40a4-a323-1b0e24890492",
                            "platform": "ATOM",
                            "memo": "BINARY:ATOM TEST",
                            "default_flg": true,
                            "updated_by": 115,
                            "updated_at": "2020-04-13T09:05:47.640Z",
                            "partner_updated_by": "53861af9-f058-4f2a-9b5a-409f11607019"
                        }
                    ]
                }
            }
 *             
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
 * /web/partners/{partner_id}/memos/histories:
 *   get:
 *     summary: get list partner memo history
 *     tags:
 *       - Memo
 *     description: get list partner history
 *     parameters:
 *       - name: partner_id
 *         in: path
 *         type: string
 *         required: true
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
 *            {
                "data": {
                    "items": [
                        {
                            "id": "6a547aac-76ba-450f-acbe-0e25d5d293c1",
                            "platform": "ATOM",
                            "memo": "BINARY:ATOM",
                            "default_flg": false,
                            "updated_by": 71,
                            "updated_at": "2020-03-30T07:21:06.420Z",
                            "updated_by_user_name": "Myhn"
                        },
                        {
                            "id": "9d284127-3e71-4d41-9b61-f48d0910877e",
                            "platform": "IRIS",
                            "memo": "Infinitooo:IRIS",
                            "default_flg": false,
                            "updated_by": 71,
                            "updated_at": "2020-03-30T07:16:36.928Z",
                            "updated_by_user_name": "Hung"
                        },
                        {
                            "id": "e71887da-8d24-4c56-b8ed-3ca0fec9719c",
                            "platform": "IRIS",
                            "memo": "Infinito:IRISs",
                            "default_flg": false,
                            "updated_by": 71,
                            "updated_at": "2020-03-30T07:20:57.111Z",
                            "updated_by_user_name": null
                        }
                    ],
                    "offset": 0,
                    "limit": 10,
                    "total": 3
                }
            }
 *             
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