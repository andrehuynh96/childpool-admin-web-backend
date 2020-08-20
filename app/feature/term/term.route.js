const express = require('express');
const validator = require("app/middleware/validator.middleware");
const schema = require("./term.request-schema");
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./term.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get('/terms',
  authenticate,
  authority(PermissionKey.VIEW_LIST_TERM),
  controller.getAll
);

router.get('/terms/:term_no',
  authenticate,
  authority(PermissionKey.VIEW_TERM_DETAIL),
  controller.getDetail
);

router.post('/terms',
  authenticate,
  authority(PermissionKey.CREATE_TERM),
  validator(schema),
  controller.create
);

router.put('/terms/:term_no',
  authenticate,
  authority(PermissionKey.UPDATE_TERM),
  validator(schema),
  controller.update
);



module.exports = router;

/** *******************************************************************/


/**
 * @swagger
 * /web/terms:
 *   get:
 *     summary: get list term
 *     tags:
 *       - Terms
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
                              "id": 1,
                              "content": "ABC123",
                              "applied_date": "2020-08-20T08:01:03.569Z",
                              "term_no": "GKU1I3T0",
                              "is_published": true,
                              "created_by": 32,
                              "updated_by": 32,
                              "createdAt": "2020-08-20T08:01:03.569Z",
                              "updatedAt": "2020-08-20T08:32:24.958Z"
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

/** *******************************************************************/

 /**
 * @swagger
 * /web/terms/{term_no}:
 *   get:
 *     summary: get term by term_no
 *     tags:
 *       - Terms
 *     description:
 *     parameters:
 *       - name: term_no
 *         in: path
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
                      "id": 1,
                      "content": "ABC123",
                      "applied_date": null,
                      "term_no": "GKU1I3T0",
                      "is_published": true,
                      "created_by": 32,
                      "updated_by": 32,
                      "createdAt": "2020-08-20T08:01:03.569Z",
                      "updatedAt": "2020-08-20T08:01:03.569Z"
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

 /** *******************************************************************/

 /**
 * @swagger
 * /web/terms:
 *   post:
 *     summary: create term
 *     tags:
 *       - Terms
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to register.
 *         schema:
 *            type: object
 *            example:
 *                  {
                        "content": "...<html tag>",
                        "is_published": true,
                        "applied_date": "2020-08-20T08:01:03.569Z"
                    }
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
                      "content": "ABC123",
                      "is_published": true,
                      "term_no": "71TBUEFZ",
                      "created_by": 32,
                      "updated_by": 32,
                      "updatedAt": "2020-08-20T08:40:55.935Z",
                      "createdAt": "2020-08-20T08:40:55.935Z",
                      "applied_date": null
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

/** *******************************************************************/

 /**
 * @swagger
 * /web/terms/{term_no}:
 *   put:
 *     summary: update term
 *     tags:
 *       - Terms
 *     description:
 *     parameters:
 *       - name: term_no
 *         in: path
 *         type: string
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to register.
 *         schema:
 *            type: object
 *            example:
 *                  {
                        "content": "ABC123",
                        "is_published": true,
                        "applied_date": "2020-08-20T08:01:03.569Z"
                    }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                  "data": {
                      "id": 1,
                      "content": "ABC123",
                      "applied_date": "2020-08-20T08:01:03.569Z",
                      "term_no": "GKU1I3T0",
                      "is_published": true,
                      "created_by": 32,
                      "updated_by": 32,
                      "createdAt": "2020-08-20T08:01:03.569Z",
                      "updatedAt": "2020-08-20T08:32:24.958Z"
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