const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./claim-request.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.get(
    '/claim-requests',
    authenticate,
    authority(PermissionKey.MEMBERSHIP_VIEW_CLAIM_REQUEST_LIST),
    controller.search
);

module.exports = router;

/*********************************************************************/
/**
 * @swagger
 * /web/membership/claim-requests:
 *   get:
 *     summary: search claim request
 *     tags:
 *       - Claim Request
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
 *       - name: from
 *         in: query
 *         type: string
 *       - name: to
 *         in: query
 *         type: string
 *       - name: email
 *         in: query
 *         type: string
 *       - name: status
 *         in: query
 *         type: string
 *       - name: payment
 *         in: query
 *         type: string
 *       - name: CryptoPlatform
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
                                "id": 1,
                                "member_id": "8337b3e4-b8be-4594-bca3-d6dba7c751ea",
                                "member_account_id": 1,
                                "type": "Bank",
                                "status": "pending",
                                "currency_symbol": "ETH",
                                "account_number": "test",
                                "bank_name": "VCB",
                                "branch_name": "Tan son nhat",
                                "account_holder": "test",
                                "wallet_address": "0x1d5b6c8390b5d1c94c1042f3ae74c02070ce35ce",
                                "txid": "C52FD3D80BD7249D5094BDB5793317C2FCEBC221BCF313987AFA230A0518ECCD",
                                "createdAt": "2020-05-29T06:15:07.006Z",
                                "updatedAt": "2020-05-29T06:15:07.006Z"
                            }
                        ],
                        "offset": 0,
                        "limit": 10,
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
/*********************************************************************/
