const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./member-asset.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const router = express.Router();

router.get('/member-assets',
  authenticate,
  authority(PermissionKey.VIEW_LIST_MEMBER_ASSET),
  controller.search
);

router.get('/member-assets-csv',
  authenticate,
  authority(PermissionKey.EXPORT_MEMBER_ASSET_CSV),
  controller.downloadCSV
);

module.exports = router;

/** *******************************************************************/
/**
 * @swagger
 * /web/member-assets:
 *   get:
 *     summary: Search member assets
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
                              "platform": "ONT",
                              "address": "AXFLrvFhYXP5obxqWV4X61wgS3vmzopeSc",
                              "balance": 0,
                              "amount": 0,
                              "createdAt": "2020-09-03T08:04:03.371Z",
                              "updatedAt": "2020-09-03T08:04:03.371Z"
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
