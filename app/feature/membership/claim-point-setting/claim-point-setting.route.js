const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./claim-point-setting.controller');
const authority = require('app/middleware/authority.middleware');
const validator = require("app/middleware/validator.middleware");
const { update } = require("./validator");
const PermissionKey = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.get('/claim-points/settings',
  authenticate,
  authority(PermissionKey.VIEW_CLAIM_MS_POINT_SETTINGS),
  controller.get
);

router.put('/claim-points/settings',
  authenticate,
  authority(PermissionKey.UPDATE_CLAIM_MS_POINT_SETTINGS),
  validator(update),
  controller.update
);

/**
 * @swagger
 * /web/membership/claim-points/settings:
 *   get:
 *     summary: get claim ms point setting
 *     tags:
 *       - Claim Point
 *     description:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                        "Bank": "Bank",
                        "Crypto": "Crypto"
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
* /web/membership/claim-points/settings:
*   put:
*     summary: update claim ms point setting
*     tags:
*       - Claim Point
*     description: update claim ms point setting
*     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON to update.
*         schema:
*            type: object
*            required:
*            - claimPoints
*            - delayTime
*            example:
*                  {
                        "claimPoints": {
                            "Silver": 1,
                            "Gold": 5,
                            "Platinum": 10
                        },
                        "delayTime": "86400"
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

module.exports = router;

