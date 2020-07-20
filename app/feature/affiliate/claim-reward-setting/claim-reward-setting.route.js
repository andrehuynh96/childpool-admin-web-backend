const express = require('express');
const validator = require("app/middleware/validator.middleware");
const { update } = require("./validator");
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./claim-reward-setting.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get(
  '/claim-reward-setting',
  authenticate,
  authority(PermissionKey.AFFILIATE_VIEW_CLAIM_REWARD_SETTING),
  controller.get
);

router.post(
  '/claim-reward-setting',
  authenticate,
  authority(PermissionKey.AFFILIATE_UPDATE_CLAIM_REWARD_SETTING),
  validator(update),
  controller.update
);


module.exports = router;


/**
* @swagger
* /web/affiliate/claim-reward-setting:
*   get:
*     summary: get property claim reward setting
*     tags:
*       - Affiliate
*     description: get property claim reward setting
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data": {
                      "claim_affiliate_reward_atom" : 0.5,
                      "claim_affiliate_reward_iris" : 0.5,
                      "claim_affiliate_reward_ong" : 0.5
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
* /web/affiliate/claim-reward-setting:
*   post:
*     summary: update claim reward setting
*     tags:
*       - Affiliate
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
                     "claim_affiliate_reward_atom" : 0.5,
                      "claim_affiliate_reward_iris" : 0.5,
                      "claim_affiliate_reward_ong" : 0.5
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
