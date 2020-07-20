const express = require('express');
const validator = require("app/middleware/validator.middleware");
const { update } = require("./validator");
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./reward-setting.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get(
  '/reward-setting',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_VIEW_CLAIM_MEMBERSHIP_REWARD_SETTING),
  controller.get
);

router.put(
  '/reward-setting',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_UPDATE_CLAIM_MEMBERSHIP_REWARD_SETTING),
  validator(update),
  controller.update
);

module.exports = router;

/**
* @swagger
* /web/membership/reward-setting:
*   get:
*     summary: get config membership type
*     tags:
*       - Membership Type Config
*     description: get config membership type
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data": {
                  "membership_commission_usdt_minimum_claim_amount": 50
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
* /web/membership/reward-setting:
*   put:
*     summary: update config membership type
*     tags:
*       - Membership Type Config
*     description: update config membership type
*     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                      "data": true
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
