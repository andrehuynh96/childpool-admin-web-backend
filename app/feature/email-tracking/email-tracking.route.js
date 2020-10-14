const express = require('express');
const controller = require('./email-tracking.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const validator = require('app/middleware/validator.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const { search } = require('./validator');
const router = express.Router();

router.get('/email-trackings',
  authenticate,
  authority(PermissionKey.VIEW_LIST_EMAIL_TRACKING),
  validator(search, 'query'),
  controller.search
);

/**
* @swagger
* /web/email-trackings:
*   get:
*     summary: get email template list
*     tags:
*       - Email Tracking
*     description: get email tracking list
*     parameters:
*       - name: limit
*         in: query
*         type: integer
*         format: int32
*       - name: offset
*         in: query
*         type: integer
*         format: int32
*       - name: email
*         in: query
*         type: string
*       - name: status
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
                            "id": "28838a62-d7f8-4490-a287-b155c31fee4e",
                            "email": "ngocmy12a06@gmail.com",
                            "subject": "MOONSTAKE - New IP Confirmation",
                            "body": "....",
                            "status": "SUCCESS",
                            "num_of_views": 6,
                            "mail_message_id": "<28d29c6f-3b26-0306-844b-d5bcc933ff04@moonstake.io>",
                            "diagnostic_code": null,
                            "error_message": null,
                            "sent_result": "{}",
                            "createdAt": "2020-09-25T08:31:19.164Z",
                            "updatedAt": "2020-09-28T04:41:44.656Z"
                        }
                    ],
                    "limit": 10,
                    "offset": 0,
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

router.get('/email-trackings/statuses',
  controller.getStatuses
);

/**
* @swagger
* /web/email-trackings/statuses:
*   get:
*     summary: get email tracking statuses
*     tags:
*       - Email Tracking
*     description: get email tracking statuses
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
                          "label": "Success",
                          "value": "SUCCESS"
                      },
                      {
                          "label": "Failed",
                          "value": "FAILED"
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

router.get('/email-trackings/:id/details',
  authenticate,
  authority(PermissionKey.VIEW_EMAIL_TRACKING_DETAIL),
  controller.details
);

/**
* @swagger
* /web/email-trackings/{id}/details:
*   get:
*     summary: get email tracking details
*     tags:
*       - Email Tracking
*     description: get email tracking details
*     parameters:
*       - name: id
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
                  "id": "28838a62-d7f8-4490-a287-b155c31fee4e",
                  "email": "ngocmy12a06@gmail.com",
                  "subject": "MOONSTAKE - New IP Confirmation",
                  "body": "....",
                  "status": "SUCCESS",
                  "num_of_views": 6,
                  "mail_message_id": "<28d29c6f-3b26-0306-844b-d5bcc933ff04@moonstake.io>",
                  "diagnostic_code": null,
                  "error_message": null,
                  "sent_result": "{}",
                  "createdAt": "2020-09-25T08:31:19.164Z",
                  "updatedAt": "2020-09-28T04:41:44.656Z"
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

router.get('/email-trackings/:id',
  controller.view
);



module.exports = router;
