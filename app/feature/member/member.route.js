const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./member.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.get(
	'/members',
	authenticate,
	authority(PermissionKey.VIEW_LIST_MEMBER),
	controller.search
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
 *       - name: member_sts
 *         in: query
 *         type: string  UNACTIVATED|ACTIVATED|LOCKED
 *       - name: fullname
 *         in: query
 *         type: string
 *       - name: phone
 *         in: query
 *         type: string
 *       - name: address
 *         in: query
 *         type: string
 *       - name: email
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
 *                 "data": {
                      "items": [
                          {
                              "id": "fc59fa67-c05a-493b-bba5-1a1d823f1aad",
                              "email": "trinhdn@blockchainlabs.asia",
                              "twofa_enable_flg": false
                          },
                          {
                              "id": "7a52ffc8-b185-49d3-ae62-2d6c06704238",
                              "email": "test1@gmail.com",
                              "twofa_enable_flg": false
                          }
                      ],
                      "offset": 0,
                      "limit": 10,
                      "total": 2
                  }
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
