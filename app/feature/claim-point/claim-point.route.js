const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./claim-point.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const validator = require("app/middleware/validator.middleware");
const { search } = require('./validator');

const router = express.Router();

/* #region  Search claim points */
/**
 * @swagger
 * /web/claim-points:
 *   get:
 *     summary: Search claim points
 *     tags:
 *       - Claim Point
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
                              "id": "1",
                              "member": {
                                  "id": "71b18ecd-f0c9-428c-b882-13752332021d",
                                  "email": "hungtv+150035@blockchainlabs.asia"
                              },
                              "member_id": "71b18ecd-f0c9-428c-b882-13752332021d",
                              "status": "Claim",
                              "amount": "100",
                              "currency_symbol": "MS_POINT",
                              "system_type": "MEMBERSHIP",
                              "created_at": "2020-07-21T08:51:20.000Z",
                              "updated_at": "2020-07-21T08:51:20.000Z"
                          },
                          {
                              "id": "2",
                              "member": {
                                  "id": "71b18ecd-f0c9-428c-b882-13752332021d",
                                  "email": "hungtv+150035@blockchainlabs.asia"
                              },
                              "member_id": "71b18ecd-f0c9-428c-b882-13752332021d",
                              "status": "Claim",
                              "amount": "100",
                              "currency_symbol": "MS_POINT",
                              "system_type": "MEMBERSHIP",
                              "created_at": "2020-07-21T08:51:20.000Z",
                              "updated_at": "2020-07-21T08:51:20.000Z"
                          },
                          {
                              "id": "3",
                              "member": {
                                  "id": "71b18ecd-f0c9-428c-b882-13752332021d",
                                  "email": "hungtv+150035@blockchainlabs.asia"
                              },
                              "member_id": "71b18ecd-f0c9-428c-b882-13752332021d",
                              "status": "Claim",
                              "amount": "100",
                              "currency_symbol": "MS_POINT",
                              "system_type": "MEMBERSHIP",
                              "created_at": "2020-07-21T08:51:20.000Z",
                              "updated_at": "2020-07-21T08:51:20.000Z"
                          },
                          {
                              "id": "4",
                              "member": {
                                  "id": "71b18ecd-f0c9-428c-b882-13752332021d",
                                  "email": "hungtv+150035@blockchainlabs.asia"
                              },
                              "member_id": "71b18ecd-f0c9-428c-b882-13752332021d",
                              "status": "Claim",
                              "amount": "100",
                              "currency_symbol": "MS_POINT",
                              "system_type": "MEMBERSHIP",
                              "created_at": "2020-07-21T08:51:20.000Z",
                              "updated_at": "2020-07-21T08:51:20.000Z"
                          }
                      ],
                      "offset": 0,
                      "limit": 25,
                      "total": 8
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

router.get(
  '/claim-points',
  authenticate,
  authority(PermissionKey.VIEW_CLAIM_MS_POINT_HISTORIES),
  validator(search, 'query'),
  controller.search
);
/* #endregion */

module.exports = router;
