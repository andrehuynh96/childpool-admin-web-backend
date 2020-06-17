const express = require('express');
const validator = require("app/middleware/validator.middleware");
const { update } = require("./validator");
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./membership-type-config.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get(
  '/membership-type-config',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_VIEW_MEMBERSHIP_TYPE_CONFIG),
  controller.get
);

router.post(
  '/membership-type-config',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_UPDATE_MEMBERSHIP_TYPE_CONFIG),
  validator(update),
  controller.update
);

module.exports = router;

/**
* @swagger
* /web/membership/membership-type-config:
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
                      "membership_type_free_membership_flg" : true,
                      "membership_type_upgrade_paid_member_flg" : true,
                      "upgrade_to_membership_type_id": "88fda933-0658-49c4-a9c7-4c0021e9a071"
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
* /web/membership/membership-type-config:
*   post:
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
                      "membership_type_free_membership_flg" : true,
                      "membership_type_upgrade_paid_member_flg" : true,
                      "upgrade_to_membership_type_id": "88fda933-0658-49c4-a9c7-4c0021e9a071"
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
