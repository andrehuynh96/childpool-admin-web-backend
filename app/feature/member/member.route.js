const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./member.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.get(
    '/members',
    authenticate,
    // authority(PermissionKey.MEMBERSHIP_VIEW_MEMBER_LIST),
    controller.search
);

router.get("/members/:memberId",
    authenticate,
    // authority(PermissionKey.MEMBERSHIP_VIEW_MEMBER_DETAIL),
    controller.getMemberDetail
);

router.put("/members/:memberId",
    authenticate,
    // authority(PermissionKey.MEMBERSHIP_UPDATE_MEMBER),
    controller.updateMember
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

/**
* @swagger
* /web/members/{memberId}:
*   get:
*     summary: get member detail
*     tags:
*       - Members
*     description:
*     parameters:
*       - name: memberId
*         in: path
*         type: string
*         required: true
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                   "data": {
                       "id": "8337b3e4-b8be-4594-bca3-d6dba7c751ea",
                       "email": "myhn@blockchainlabs.asia",
                       "referral_code": "CMMGT1VEX",
                       "referrer_code": "",
                       "membership_type_id": 1,
                       "membership_type": "Free",
                       "kyc_id": "5ea90045780db51bed6e756e",
                       "kyc_level": 1,
                       "kyc_status": "Approved",
                       "deleted_flg": false,
                       "plutx_userid_id": "6df1391b-96a7-4207-8640-d331b4e26768"
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
 * /web/members/{memberId}:
 *   put:
 *     summary: update member
 *     tags:
 *       - Members
 *     description: update user profile
 *     parameters:
 *       - name: memberId
 *         in: path
 *         type: string
 *         required: true
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to update.
 *         schema:
 *            type: object
 *            required:
 *            - membershipTypeId
 *            - referrerCode
 *            example:
 *                  {
                        "membershipTypeId": "88fda933-0658-49c4-a9c7-4c0021e9a071",
                        "referrerCode":"S0GYV2CXY"
 *                  }
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

/*********************************************************************/
