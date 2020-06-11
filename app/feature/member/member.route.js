const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./member.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.get(
	'/members',
	authenticate,
	// authority(PermissionKey.VIEW_LIST_MEMBER),
	controller.search
);

route.get("/members/:memberId",
    authenticate, 
  controller.getMemberDetail
);

module.exports = router;




/*********************************************************************/


/**
 * @swagger
 * /web/members:
 *   get:
 *     summary: search member
 *     tags:
 *       - Members
 *     description:
 *     parameters:
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: name
 *         in: query
 *         type: string 
 *       - name: email
 *         in: query
 *         type: string
 *       - name: membershipTypeId
 *         in: query
 *         type: string
 *       - name: referralCode
 *         in: query
 *         type: string
 *       - name: referrer
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
                                "id": "b14a3095-d82a-46c7-9797-478c333c9c83",
                                "email": "ngocmy12a06@gmail.com",
                                "referral_code": "",
                                "referrer_code": "",
                                "kyc_id": "0",
                                "kyc_level": 1,
                                "kyc_status": "Approved",
                                "deleted_flg": false,
                                "plutx_userid_id": "fe61eee1-7540-403f-8bc2-03b9ec134f96"
                            },
                            {
                                "id": "37394288-d0bf-47d3-8886-0ed68642b269",
                                "email": "tommyalan2410@gmail.com",
                                "referral_code": "",
                                "referrer_code": "",
                                "kyc_id": "0",
                                "kyc_level": 1,
                                "kyc_status": "Approved",
                                "deleted_flg": false,
                                "plutx_userid_id": "a4ca67fc-a8db-43be-83dd-e0c843d4b573"
                            }
                        ],
                        "offset": 0,
                        "limit": 10,
                        "total": 2
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

/*********************************************************************/
