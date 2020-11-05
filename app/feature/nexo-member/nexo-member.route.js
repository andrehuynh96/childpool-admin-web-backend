const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./nexo-member.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

/* #region Search nexo member */
router.get(
  '/nexo-members',
  authenticate,
  authority(PermissionKey.VIEW_LIST_NEXO_MEMBER),
  controller.search
);
/**
* @swagger
* /web/nexo-members:
*   get:
*     summary: Search nexo members
*     tags:
*       - Nexo
*     description:
*     parameters:
*       - name: email
*         in: query
*         type: string
*       - name: last_name
*         in: query
*         type: string
*       - name: first_name
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
                            "id": "e7eeefa2-7f01-4b12-9895-74fd6fa9c4ee",
                            "member_id": "a5edcce6-c8c9-448c-a903-4806668b3c7a",
                            "email": "thangdv@blockchainlabs.asia",
                            "from_currency": "USD",
                            "to_cryptocurrency": "BTC",
                            "payment_method": "debit-card",
                            "from_amount": "1",
                            "status": "NEW",
                            "provider": "SENDWYRE",
                            "created_at": "2020-10-30T09:04:58.552Z",
                            "updated_at": "2020-10-30T09:04:58.552Z"
                        },
                        {
                            "id": "c593e4aa-377d-4db3-9e98-6e03753a11b6",
                            "member_id": "a5edcce6-c8c9-448c-a903-4806668b3c7a",
                            "email": "thangdv@blockchainlabs.asia",
                            "from_currency": "USD",
                            "to_cryptocurrency": "BTC",
                            "payment_method": "debit-card",
                            "payment_method_name": "Visa ending 1111",
                            "transaction_id": "TF_CRDXC3WBEWH",
                            "from_amount": "6.69",
                            "to_amount": "0.00007265",
                            "status": "COMPLETE",
                            "provider": "SENDWYRE",
                            "created_at": "2020-10-30T08:20:05.470Z",
                            "updated_at": "2020-10-30T10:28:03.322Z"
                        }
                    ],
                    "limit": 2,
                    "offset": 0,
                    "total": 11
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
/* #endregion */

/* #region Export nexo member csv */
router.get(
  '/nexo-members/csv',
  authenticate,
  authority(PermissionKey.EXPORT_LIST_NEXO_MEMBER_CSV),
  controller.downloadCSV
);
/**
* @swagger
* /web/nexo-members/csv:
*   get:
*     summary: export nexo members csv
*     tags:
*       - Nexo
*     description:
*     parameters:
*       - name: email
*         in: query
*         type: string
*       - name: last_name
*         in: query
*         type: string
*       - name: first_name
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
                "data": {}
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
/* #endregion */

module.exports = router;

