const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./member-asset.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const router = express.Router();

router.get('/member-asset',
  authenticate,
  authority(PermissionKey.VIEW_LIST_MEMBER_ASSET),
  controller.search
);

module.exports = router;

/** *******************************************************************/
/**
 * @swagger
 * /web/member-asset:
 *   get:
 *     summary: search member asset
 *     tags:
 *       - Member Asset
 *     description:
 *     parameters:
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
 *       - name: from_date
 *         in: query
 *         type: string
 *       - name: to_date
 *         in: query
 *         type: string
 *       - name: email
 *         in: query
 *         type: string
 *       - name: platform
 *         in: query
 *         type: string
 *       - name: address
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
                    "data": {
                        "items": [
                            {
                                "id": "3e7b875a-fde5-4fbe-835c-d1cb28a5c67b",
                                "member_id": "4e6c23fb-9f88-4901-86ba-9a025fcfc517",
                                "platform": "ONT",
                                "address": "AXFLrvFhYXP5obxqWV4X61wgS3vmzopeSc",
                                "balance": 0,
                                "amount": 0,
                                "createdAt": "2020-09-03T08:04:03.371Z",
                                "updatedAt": "2020-09-03T08:04:03.371Z",
                                "Member": {
                                    "email": "hungtm+dev1@blockchainlabs.asia"
                                }
                            }
                        ],
                        "offset": 0,
                        "limit": 10,
                        "total": 1
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

 /** *******************************************************************/