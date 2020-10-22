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
*       - name: from_date
*         in: query
*         type: string
*       - name: to_date
*         in: query
*         type: string
*       - name: keyword
*         in: query
*         type: string
*       - name: wallet_address
*         in: query
*         type: string
*       - name: type
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
                            "id": "3",
                            "type": "DAILY_REWARD",
                            "message": "Love Medicine is Louise Erdrichs debut novel, first published in 1984. Erdrich revised and expanded the novel in subsequent 1993 and 2009 editions. The book follows the lives of five interconnected Ojibwe families living on fictional reservations in Minnesota and North Dakota.",
                            "wallet_address": "AGBnd6d8LwsmJpnuYphRVKvQZ8kJJtbBiH",
                            "created_at": "2020-08-28T06:58:42.000Z",
                            "updated_at": "2020-08-28T06:58:42.000Z"
                        }
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
                  "id": "1",
                  "type": "DAILY_REWARD",
                  "message": "Love Medicine is Louise Erdrichs debut novel, first published in 1984. Erdrich revised and expanded the novel in subsequent 1993 and 2009 editions. The book follows the lives of five interconnected Ojibwe families living on fictional reservations in Minnesota and North Dakota.",
                  "wallet_address": null,
                  "created_at": "2020-08-28T06:58:42.000Z",
                  "updated_at": "2020-08-28T06:58:42.000Z"
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
