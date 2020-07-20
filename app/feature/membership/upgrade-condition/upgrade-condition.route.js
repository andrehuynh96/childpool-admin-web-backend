const express = require('express');
const validator = require("app/middleware/validator.middleware");
const { update } = require("./validator");
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./upgrade-condition.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get(
  '/upgrade-condition',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_VIEW_UPGRADE_CONDITION),
  controller.get
);

router.post(
  '/upgrade-condition',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_UPDATE_UPGRADE_CONDITION),
  validator(update),
  controller.update
);


module.exports = router;


/**
* @swagger
* /web/membership/upgrade-condition:
*   get:
*     summary: get property upgrade condition
*     tags:
*       - Membership Upgrade Condition
*     description: get property upgrade condition
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data": {
                      "allow_upgrade_flg" : true,
                      "num_of_paid_members" : 5,
                      "num_of_free_members" : 5,
                      "staking_amount" : 5,
                      "staking_amount_currency_symbol": "USD",
                      "staking_reward": 5,
                      "staking_reward_currency_symbol": "USD"
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
* /web/membership/upgrade-condition:
*   post:
*     summary: update upgrade condition
*     tags:
*       - Membership Upgrade Condition
*     description: update upgrade condition
*     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                      "allow_upgrade_flg" : true,
                      "num_of_paid_members" : 5,
                      "num_of_free_members" : 5,
                      "staking_amount" : 5,
                      "staking_amount_currency_symbol": "USD",
                      "staking_reward": 5,
                      "staking_reward_currency_symbol": "USD"
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
