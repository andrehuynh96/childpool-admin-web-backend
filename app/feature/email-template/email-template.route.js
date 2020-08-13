const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const controller = require('./email-template.controller');
const validator = require('app/middleware/validator.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const {
  update,
  createOption,
  updateOption,
} = require('./validator');

const router = express.Router();

router.get('/email-templates',
  authenticate,
  authority(PermissionKey.VIEW_EMAIL_TEMPLATE_LIST),
  controller.search
);

router.get('/email-templates/:name',
  authenticate,
  authority(PermissionKey.VIEW_EMAIL_TEMPLATE_DETAIL),
  controller.getDetail
);

router.put('/email-templates',
  authenticate,
  authority(PermissionKey.UPDATE_EMAIL_TEMPLATE),
  validator(update),
  controller.update
);

router.get('/email-templates/reasons/group-names',
  authenticate,
  controller.getGroupName
);

router.get('/email-templates/options',
  authenticate,
  controller.getEmailTemplatesOptionsByGroupName
);

router.post('/email-templates/options',
  validator(createOption),
  authenticate,
  authority(PermissionKey.CREATE_EMAIL_TEMPLATE),
  controller.createEmailTemplateOption
);

router.post('/email-templates/options/:name/duplicate',
  authenticate,
  authority(PermissionKey.CREATE_EMAIL_TEMPLATE),
  controller.duplicateEmailTemplateOption
);

router.put('/email-templates/options/:name',
  validator(updateOption),
  authenticate,
  authority(PermissionKey.CREATE_EMAIL_TEMPLATE),
  controller.updateEmailTemplateOption
);

router.delete('/email-templates/options/:name',
  authenticate,
  authority(PermissionKey.DELETE_EMAIL_TEMPLATE),
  controller.deleteEmailTemplateOption
);

/**
* @swagger
* /web/email-templates:
*   get:
*     summary: get email template list
*     tags:
*       - Email Template
*     description: get email template list
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
                            "id": "248d4760-5c58-4e36-87da-a796c39c783d",
                            "name": "CONFIRM_IP",
                            "subject": "Confirm new ip address",
                            "language": "en",
                            "deleted_flg": false
                        },
                        {
                            "id": "872a4a9d-cabe-4524-a01d-c70f74884d2a",
                            "name": "MEMBERSHIP_ORDER_APPROVED",
                            "subject": "Membership payment",
                            "language": "en",
                            "deleted_flg": false
                        },
                        {
                            "id": "872a4a9d-cabe-4524-a01d-c70f74884d2b",
                            "name": "MEMBERSHIP_ORDER_APPROVED",
                            "subject": "Membership payment jp",
                            "language": "jp",
                            "deleted_flg": false
                        },
                        {
                            "id": "872a4a9d-cabe-4524-a01d-c70f74884d2c",
                            "name": "MEMBERSHIP_ORDER_REJECTED",
                            "subject": "Membership payment",
                            "language": "en",
                            "deleted_flg": false
                        },
                        {
                            "id": "872a4a9d-cabe-4524-a01d-c70f74884d21",
                            "name": "TRANSACTION_RECEIVED",
                            "subject": "Received coin/token alert",
                            "language": "en",
                            "deleted_flg": false
                        },
                        {
                            "id": "872a4a9d-cabe-4524-a01d-c70f74884d22",
                            "name": "TRANSACTION_SENT",
                            "subject": "Received coin/token alert",
                            "language": "en",
                            "deleted_flg": false
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

/**
* @swagger
* /web/email-templates/{name}:
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
* /web/email-templates:
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
* /web/email-templates/reasons/group-names:
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
* /web/email-templates/options:
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
* /web/email-templates/options:
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
* /web/email-templates/options/{name}:
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
* /web/email-templates/options/{name}/duplicate:
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
* /web/email-templates/options/{name}:
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
