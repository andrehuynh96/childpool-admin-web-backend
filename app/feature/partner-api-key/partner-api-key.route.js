const express = require("express");
const controller = require("./partner-api-key.controller");
const { create } = require("./validator");
const validator = require("app/middleware/validator.middleware");
const authenticate = require('app/middleware/authenticate.middleware');
const route = express.Router();

route.get("/partners/:id/keys",
  authenticate,
  controller.getAll
);

route.post("/partners/:id/keys",
  validator(create),
  authenticate,
  controller.create
);

module.exports = route;

/**
 * @swagger
 * /web/partners/{id}/keys:
 *   get:
 *     summary: get list of all API key
 *     tags:
 *       - API key
 *     description: get list of all API key
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
                                "id": "60bd0a85-cc4b-4a36-bc36-48b950b688fd",
                                "partner_id": "8f3d8b76-7915-493c-88f2-94ee074a56f2",
                                "name": "INF",
                                "api_key": "0946b0e4-f010-4270-81ec-2ac6bf64c0e3",
                                "secret_key": "y6D9XnAeLlGE9dKPwgLFnwO37NMr1xzj",
                                "status": "CONNECTED",
                                "actived_flg": true,
                                "created_by": 83,
                                "createdAt": "2020-03-05T09:45:20.394Z",
                                "updatedAt": "2020-03-23T09:08:31.013Z"
                            },
                            {
                                "id": "57d8ea98-440f-4a3b-88f0-4a61a0a3350b",
                                "partner_id": "8f3d8b76-7915-493c-88f2-94ee074a56f2",
                                "name": "Phinek",
                                "api_key": "8228aa97-47f9-4f82-8616-af96822ff5d7",
                                "secret_key": "PKQBZxjN31D6qo3NnNKHmQREXAL6d7Wq",
                                "status": "NOT_CONNECT",
                                "actived_flg": true,
                                "created_by": 75,
                                "createdAt": "2020-02-27T11:19:03.654Z",
                                "updatedAt": "2020-02-27T11:19:03.654Z"
                            }
                        ],
                        "offset": 0,
                        "limit": 10,
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
 /**
 * @swagger
 * /web/partners/{id}/keys:
 *   post:
 *     summary: create a new API key
 *     tags:
 *       - API key
 *     description: reate a new API key
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Info of new API key
 *         schema:
 *            type: object
 *            required:
 *            - name
 *            example:
 *               {
                        name: "MYHN"
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
                        "id": "c487a17d-1992-4324-8847-b8cc25acecd7",
                        "api_key": "5f4ddc88-02d6-4f72-abc2-082ed86205ff",
                        "status": "NOT_CONNECT",
                        "partner_id": "8f3d8b76-7915-493c-88f2-94ee074a56f2",
                        "name": "MYHN",
                        "secret_key": "oVN9QA29PtM2",
                        "actived_flg": true,
                        "created_by": 1,
                        "updatedAt": "2020-03-24T03:52:07.788Z",
                        "createdAt": "2020-03-24T03:52:07.788Z"
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