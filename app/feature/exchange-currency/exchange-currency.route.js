const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const controller = require('./exchange-currency.controller');
const validator = require('app/middleware/validator.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const {
  search,
  exchangeCurrencyIdParam,
  update,
  create,
} = require('./validator');

const router = express.Router();

/* #region Search exchange currencies */
router.get('/exchange-currencies',
  validator(search, 'query'),
  authenticate,
  authority(PermissionKey.VIEW_EXCHANGE_CURRENCIES),
  controller.search
);

/**
* @swagger
* /web/exchange-currencies:
*   get:
*     summary: Search exchange currencies
*     tags:
*       - Exchange
*     description:
*     parameters:
*       - name: offset
*         in: query
*         type: integer
*         format: int32
*       - name: limit
*         in: query
*         type: integer
*       - name: name
*         in: query
*         type: string
*       - name: platform
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
                            "id": 3,
                            "symbol": "ETH",
                            "platform": "ETH",
                            "name": "Ethereum",
                            "icon": "https://web-api.changelly.com/api/coins/eth.png",
                            "order_index": 0,
                            "status": 1,
                            "from_flg": true,
                            "to_flg": true,
                            "fix_rate_flg": true,
                            "created_at": "2020-09-04T07:27:17.601Z",
                            "updated_at": "2020-09-04T07:27:17.601Z"
                        },
                        {
                            "id": 4,
                            "symbol": "XEM",
                            "platform": "XEM",
                            "name": "NEM",
                            "icon": "https://web-api.changelly.com/api/coins/xem.png",
                            "order_index": 0,
                            "status": 1,
                            "from_flg": true,
                            "to_flg": true,
                            "fix_rate_flg": true,
                            "created_at": "2020-09-04T07:27:17.601Z",
                            "updated_at": "2020-09-04T07:27:17.601Z"
                        }
                    ],
                    "offset": 0,
                    "limit": 10,
                    "total": 6
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

router.get('/exchange-currencies/:exchangeCurrencyId',
  validator(exchangeCurrencyIdParam, 'params'),
  authenticate,
  authority(PermissionKey.VIEW_EMAIL_TEMPLATE_DETAIL),
  controller.getDetails
);

// router.put('/exchange-currencies',
//   authenticate,
//   authority(PermissionKey.UPDATE_EMAIL_TEMPLATE),
//   validator(update),
//   controller.update
// );


/**
* @swagger
* /web/exchange-currencies/{name}:
*   get:
*     summary: get email template detail
*     tags:
*       - Email Template
*     description: get email template detail
*     parameters:
*       - name: name
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
                "data": [
                    {
                        "id": "872a4a9d-cabe-4524-a01d-c70f74884d2b",
                        "name": "MEMBERSHIP_ORDER_APPROVED",
                        "subject": "Membership payment jp",
                        "template":"<!doctype html>\n<html>\n  <head>\ .......dai lam do",
                        "language": "en",
                        "deleted_flg": false,
                        "createdAt": "2020-02-13T03:08:47.449Z",
                        "updatedAt": "2020-02-13T03:08:47.449Z"
                    }
                ]
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
* /web/exchange-currencies:
*   put:
*     summary: update email template
*     tags:
*       - Email Template
*     description: update email template
*     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                        "email_templates":[
                            {
                                 "name": "CHILDPOOL_CONFIRM_IP",
                                 "subject": "Confirm new ip address",
                                 "template": "<!doctype html>\n<html>\n  <head>\n.......",
                                 "language": "en"
                            },
                            {
                                 "name": "CHILDPOOL_CONFIRM_IP",
                                 "subject": "新しいIPアドレスを確認",
                                 "template": "<!doctype html>\n<html>\n  <head>\n.......",
                                 "language": "jp"
                            }
                        ]
*                  }
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

/**
* @swagger
* /web/exchange-currencies/reasons/group-names:
*   get:
*     summary: get group name list
*     tags:
*       - Email Template
*     description: get group name list
*     parameters:
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                    "data": {
                        "MEMBERSHIP_ORDER_REJECTED_REASON": "MEMBERSHIP_ORDER_REJECTED_REASON"
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
* /web/email-template-options:
*   get:
*     summary: get email template reason list rejected order
*     tags:
*       - Email Template
*     description: get email template reason list rejected order
*     parameters:
*       - name: groupName
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
                "data": [
                    {
                        "id": "872a4a9d-cabe-4524-a01d-c70f74884d2b",
                        "name": "MEMBERSHIP_ORDER_APPROVED",
                        "subject": "Membership payment jp",
                        "template":"<!doctype html>\n<html>\n  <head>\ .......dai lam do",
                        "language": "en",
                        "deleted_flg": false,
                        "createdAt": "2020-02-13T03:08:47.449Z",
                        "updatedAt": "2020-02-13T03:08:47.449Z"
                    }
                ]
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
* /web/email-template-options:
*   post:
*     summary: create email template option
*     tags:
*       - Email Template
*     description: create email template option
*     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*              {
                    "option_name": "KYC_INSUFFICIENT Option 3",
                    "group_name": "CHILDPOOL_KYC_INSUFFICIENT",
                    "display_order": null,
                    "email_templates": [
                        {
                            "subject": "Confirm new ip address",
                            "template": "<!doctype html>\n<html>\n  <head>\n.......",
                            "language": "en"
                        },
                        {
                            "subject": "新しいIPアドレスを確認",
                            "template": "<!doctype html>\n<html>\n  <head>\n.......",
                            "language": "ja"
                        }
                    ]
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

/**
* @swagger
* /web/email-template-options/{name}:
*   put:
*     summary: Update email template option
*     tags:
*       - Email Template
*     description:
*     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*              {
                  "option_name" : "KYC_INSUFFICIENT Option 3 Update",
                  "display_order": 1,
                  "email_templates": [
                      {
                          "subject": "Confirm new ip address",
                          "template": "<!doctype html>\n<html>\n  <head>\n.......",
                          "language": "en"
                      },
                      {
                          "subject": "新しいIPアドレスを確認",
                          "template": "aaaaaa",
                          "language": "ja"
                      }
                  ]
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

/**
* @swagger
* /web/email-template-options/{name}/duplicate:
*   put:
*     summary: duplicate email template option
*     tags:
*       - Email Template
*     description: duplicate email template option
*     parameters:
*       - name: data
*         in: body
*         required: true
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

/**
* @swagger
* /web/email-template-options/{name}:
*   delete:
*     summary: delete email template option
*     tags:
*       - Email Template
*     description: delete email template option
*     parameters:
*       - name: data
*         in: body
*         required: true
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
module.exports = router;
