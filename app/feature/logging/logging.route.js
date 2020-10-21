const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const controller = require('./logging.controller');
const validator = require('app/middleware/validator.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const {
  search,
  loggingIdParam,
} = require('./validator');

const router = express.Router();

/* #region Search loggings */
router.get('/loggings',
  validator(search, 'query'),
  authenticate,
  authority(PermissionKey.VIEW_LOGGINGS),
  controller.search
);

/**
* @swagger
* /web/loggings:
*   get:
*     summary: Search loggings
*     tags:
*       - Notification
*     description: "Required permission: VIEW_LOGGINGS."
*     parameters:
*       - name: offset
*         in: query
*         type: integer
*         format: int32
*       - name: limit
*         in: query
*         type: integer
*       - name: keyword
*         in: query
*         type: string
*       - name: type
*         in: query
*         type: string
*       - name: event
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
                            "id": 11,
                            "title": "FOO title2020-09-28 17:57:52.218975+09",
                            "content": "FOO content2020-09-28 17:57:52.218975+09",
                            "description": "やあ！すずきちゃ",
                            "title_ja": "FOO title JA2020-09-28 17:57:52.218975+09",
                            "content_ja": "こんにちは2020-09-28 17:57:52.218975+09",
                            "type": "SYSTEM",
                            "event": "NEW_INFORMATION",
                            "sent_all_flg": true,
                            "actived_flg": true,
                            "created_at": "2020-09-28T08:57:52.218Z",
                            "updated_at": "2020-09-28T08:57:52.218Z"
                        },
                        {
                            "id": 10,
                            "title": "FOO title2020-09-28 17:57:51.597363+09",
                            "content": "FOO content2020-09-28 17:57:51.597363+09",
                            "description": "やあ！すずきちゃ",
                            "title_ja": "FOO title JA2020-09-28 17:57:51.597363+09",
                            "content_ja": "こんにちは2020-09-28 17:57:51.597363+09",
                            "type": "SYSTEM",
                            "event": "NEW_INFORMATION",
                            "sent_all_flg": true,
                            "actived_flg": true,
                            "created_at": "2020-09-28T08:57:51.597Z",
                            "updated_at": "2020-09-28T08:57:51.597Z"
                        },
                    ],
                    "offset": 0,
                    "limit": 25,
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
/* #endregion */

/* #region Get logging details */
router.get('/loggings/:loggingId',
  validator(loggingIdParam, 'params'),
  authenticate,
  authority(PermissionKey.VIEW_LOGGINGS),
  controller.getDetails
);

/**
* @swagger
* /web/loggings/:loggingId:
*   get:
*     summary: Get logging details
*     tags:
*       - Notification
*     description: "Required permission: VIEW_LOGGINGS."
*     parameters:
*       - name: loggingId
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
                    "id": 2,
                    "title": "Terms and Conditions update",
                    "content": "In its the majority of standard terms: if YouTube isn’t making money off you, the company can erase your account. The platform’s existing terms of service do not include this language.YouTube is updating their Terms of Service on 10 December 2019. It presents an awful possibility for the future of creators on the platform. It seems they will be able to terminate your channel if it’s “no longer commercially viable.Check it out here: https://t.co/UrVpXmq4k5",
                    "type": "SYSTEM",
                    "event": "NEW_INFORMATION",
                    "sent_all_flg": true,
                    "actived_flg": false,
                    "created_at": "2020-09-28T08:52:50.582Z",
                    "updated_at": "2020-09-28T08:52:50.582Z"
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

/* #region Delete logging */
router.delete('/loggings/:loggingId',
  validator(loggingIdParam, 'params'),
  authenticate,
  authority(PermissionKey.DELETE_LOGGING),
  controller.delete
);

/**
* @swagger
* /web/loggings/:loggingId:
*   delete:
*     summary: Delete logging
*     tags:
*       - Notification
*     description: "Required permission: DELETE_LOGGING."
*     parameters:
*       - name: loggingId
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
/* #endregion */

module.exports = router;
