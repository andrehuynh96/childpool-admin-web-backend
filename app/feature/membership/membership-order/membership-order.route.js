const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./membership-order.controller');

const router = express.Router();

router.get(
	'/orders',
	authenticate,
	controller.search
);

router.get("/orders/:id",
    authenticate,
    controller.getOrderDetail
);

router.post("/orders/:id",
    authenticate,
    controller.approveOrder
);

module.exports = router;




/*********************************************************************/


/**
 * @swagger
 * /web/membership/orders:
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
 * /web/membership/orders/{orderId}:
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

/*********************************************************************/
