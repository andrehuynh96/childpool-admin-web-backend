const express = require('express');
const validator = require("app/middleware/validator.middleware");
const authenticate = require('app/middleware/authenticate.middleware');
const requestSchema = require('./bank-account.request.schema');
const controller = require('./bank-account.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get(
  '/bank-account/histories',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_VIEW_BANK_ACCOUNT_REWARD),
  controller.getAll
);

router.get(
  '/bank-account',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_VIEW_BANK_ACCOUNT_REWARD),
  controller.get
);

router.put(
  '/bank-account',
  authenticate,
  validator(requestSchema),
  authority(PermissionKey.MEMBERSHIP_UPDATE_BANK_ACCOUNT_REWARD),
  controller.update
);

module.exports = router;

/**
* @swagger
* /web/membership/bank-account/histories:
*   get:
*     summary: get bank account history list
*     tags:
*       -  Bank Account
*     description: get bank account history list
*     parameters:
*       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
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
                              "id": 69,
                              "bank_name": "Vietcombank",
                              "branch_name": "Bank account2",
                              "account_type": "AASS1",
                              "account_name": "NGUYEN VAN B",
                              "account_number": "12345",
                              "currency_symbol": "USD",
                              "actived_flg": true,
                              "memo": "Binh test memo\nmjkj",
                              "created_by": 86,
                              "updated_by": 0,
                              "createdAt": "2020-07-29T02:04:16.374Z",
                              "updatedAt": "2020-07-29T02:04:16.374Z"
                          },
                          {
                              "id": 68,
                              "bank_name": "Vietcombank",
                              "branch_name": "Bank account2",
                              "account_type": "AASS1",
                              "account_name": "NGUYEN VAN B",
                              "account_number": "12345",
                              "currency_symbol": "USD",
                              "actived_flg": false,
                              "memo": "Binh test memo",
                              "created_by": 86,
                              "updated_by": 86,
                              "createdAt": "2020-07-29T02:03:28.489Z",
                              "updatedAt": "2020-07-29T02:04:16.356Z"
                          },
                          {
                              "id": 67,
                              "bank_name": "Vietcombank",
                              "branch_name": "Bank account",
                              "account_type": "AASS1",
                              "account_name": "NGUYEN VAN B",
                              "account_number": "12345",
                              "currency_symbol": "USD",
                              "actived_flg": false,
                              "memo": "Binh test memo",
                              "created_by": 86,
                              "updated_by": 86,
                              "createdAt": "2020-07-29T01:58:57.692Z",
                              "updatedAt": "2020-07-29T02:03:28.474Z"
                          }
                      ],
                      "offset": 0,
                      "limit": 10,
                      "total": 66
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
* /web/membership/bank-account:
*   get:
*     summary: get membership
*     tags:
*       - Bank Account
*     description: get membership
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                   "data": {
                       "id": 1100,
                       "bank_name": "Vietcombank",
                       "swift": "123456h",
                       "account_name": "NGUYEN VAN A",
                       "account_number": "34268909879"
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
* /web/membership/bank-account:
*   put:
*     summary: Update membership
*     tags:
*       - Bank Account
*     description: Update membership
*     parameters:
*       - in: body
*         name: data
*         description: Info of new API key
*         schema:
*            type: object
*            required:
*            - name
*            example:
*               {
                  "bank_name": "Vietcombank",
                  "branch_name": "Bank account",
                  "account_name": "NGUYEN VAN B",
                  "account_number": "12345",
                  "currency_symbol": "USD",
                  "account_type": "AASS",
                  "memo": "test",
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