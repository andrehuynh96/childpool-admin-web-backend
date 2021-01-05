const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./affiliate.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const router = express.Router();

router.get(
    '/affiliate/:memberId/get-top',
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
                              "id": "126c4fc3-d57d-450a-9ecc-1ae63a40d27a",
                              "email": "hungtv+bug10001@gmail.com",
                              "fullname": null,
                              "last_name": "Hung",
                              "first_name": "bug100001",
                              "number_of_refferral": 3,
                              "referrer_code": "I6NNK6M6P",
                              "referral_code": "C8ORYQYQI",
                              "create_at": "2020-07-23T03:47:34.243Z"
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
