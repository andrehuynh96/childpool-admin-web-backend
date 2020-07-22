const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const controller = require('./email-template.controller');
const validator = require('app/middleware/validator.middleware');
const schema = require('./email-template.request-schema');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const router = express.Router();

router.get('/email-templates',
    authenticate,
    authority(PermissionKey.VIEW_EMAIL_TEMPLATE_LIST),
    controller.getAll
);

router.get('/email-templates/:id',
    authenticate,
    authority(PermissionKey.VIEW_EMAIL_TEMPLATE_DETAIL),
    controller.getDetail
);

router.put('/email-templates/:id',
    authenticate,
    authority(PermissionKey.UPDATE_EMAIL_TEMPLATE),
    validator(schema),
    controller.update
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
                        "id": "872a4a9d-cabe-4524-a01d-c70f74884d2a",
                        "name": "MEMBERSHIP_ORDER_APPROVED",
                        "subject": "Membership payment",
                        "template":"<!doctype html>\n<html>\n  <head>\ .......dai lam do",
                        "language": "en",
                        "deleted_flg": false,
                        "createdAt": "2020-02-13T03:08:47.449Z",
                        "updatedAt": "2020-02-13T03:08:47.449Z"
                    },
                    {
                        "id": "248d4760-5c58-4e36-87da-a796c39c783d",
                        "name": "CONFIRM_IP",
                        "subject": "Confirm new ip address",
                        "template":"<!doctype html>\n<html>\n  <head>\ .......dai lam do",
                        "language": "en",
                        "deleted_flg": false,
                        "createdAt": "2020-07-22T03:08:47.449Z",
                        "updatedAt": "2020-07-22T03:08:47.449Z"
                    },
                    {
                        "id": "872a4a9d-cabe-4524-a01d-c70f74884d2b",
                        "name": "MEMBERSHIP_ORDER_APPROVED",
                        "subject": "Membership payment jp",
                        "template":"<!doctype html>\n<html>\n  <head>\ .......dai lam do",
                        "language": "jp",
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
* /web/email-templates/{id}:
*   get:
*     summary: get email template detail
*     tags:
*       - Email Template
*     description: get email template detail
*     parameters:
*       - name: id
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
                        "id": "872a4a9d-cabe-4524-a01d-c70f74884d2b",
                        "name": "MEMBERSHIP_ORDER_APPROVED",
                        "subject": "Membership payment jp",
                        "template":"<!doctype html>\n<html>\n  <head>\ .......dai lam do",
                        "language": "jp",
                        "deleted_flg": false,
                        "createdAt": "2020-02-13T03:08:47.449Z",
                        "updatedAt": "2020-02-13T03:08:47.449Z"
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
* /web/email-templates/{id}:
*   put:
*     summary: update email template
*     tags:
*       - Email Template
*     description: update email template
*     parameters:
*       - name: id
*         in: path
*         type: string
*         required: true
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                      "subject": "Membership payment jp",
                      "template":"<!doctype html>\n<html>\n  <head>\ .......dai lam do"
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

module.exports = router;