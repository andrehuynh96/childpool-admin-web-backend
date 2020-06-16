const express = require('express');
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
                      "membership_type_upgrade_paid_member_flg" : true
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


