const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./policy.controller');
const validator = require("app/middleware/validator.middleware");
// const requestSchema = require('./member.request-schema');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.get(
    '/policies',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_POLICY_LIST),
    controller.getAllPolicy
);
module.exports = router;

/** *******************************************************************/
/**
 * @swagger
 * /web/membership/policies:
 *   get:
 *     summary: get policy list
 *     tags:
 *       - Policy
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
                                "id": 4,
                                "name": "Membership system - Affiliate Policy",
                                "description": "",
                                "type": "AFFILIATE",
                                "proportion_share": "10",
                                "max_levels": 5,
                                "rates": [
                                    "50",
                                    "30",
                                    "10",
                                    "7",
                                    "3"
                                ],
                                "created_at": "2020-05-08T06:32:06.283Z",
                                "updated_at": "2020-06-16T10:43:06.680Z"
                            }
                        ],
                        "offset": 0,
                        "limit": 9007199254740991,
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