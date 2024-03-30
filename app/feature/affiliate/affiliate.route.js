const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./affiliate.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const router = express.Router();

router.get(
  '/affiliate/get-top',
  authenticate,
  authority(PermissionKey.VIEW_TOP_AFFILIATE),
  controller.getTopAffiliate
);

module.exports = router;

/** ******************************************************************/

/**
 * @swagger
 * /web/affiliate/:memberId/get-top:
 *   get:
 *     summary: get top affiliate
 *     tags:
 *       - Affiliate
 *     description:
 *     parameters:
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
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
                          "id": "a9d85e5a-6d67-4018-8caf-f37eb424d364",
                          "referrer_code": null,
                          "referral_code": "XBJ3I9GV2",
                          "email": "hungtv+15000@blockchainlabs.asia",
                          "created_at": "2020-07-21T09:38:39.534Z",
                          "num_of_refers": "48"
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
