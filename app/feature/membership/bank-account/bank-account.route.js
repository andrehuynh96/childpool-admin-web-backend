const express = require('express');
const config = require('app/config');
const validator = require("app/middleware/validator.middleware");
const authenticate = require('app/middleware/authenticate.middleware');
const requestSchema = require('./bank-account.request.schema');
const controller = require('./bank-account.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

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
* /web/membership/bank-account:
*   get:
*     summary: get membership
*     tags:
*       - Membership BankAccount
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
                       "branch_name": "District One",
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
*       - Membership BankAccount
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
                  "branch_name": "District One",
                  "account_name": "NGUYEN VAN A",
                  "account_number": "34268909879"
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