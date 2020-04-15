const express = require("express");
const controller = require("./partner-commission.controller");
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const validator = require('app/middleware/validator.middleware');
const { update } = require('./validator');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const route = express.Router();

route.get("/partners/:partner_id/commissions",
	authenticate,
	authority(PermissionKey.VIEW_LIST_COMMISSION_PARTNER),
	controller.getAll
);

route.get(
	'/partners/:partner_id/commissions/histories',
	authenticate,
	authority(PermissionKey.VIEW_HISTORY_COMMISSION_PARTNER),
	controller.getHis
);

route.post(
	'/partners/:partner_id/commissions',
	authenticate,
	authority(PermissionKey.CREATE_COMMISSION_PARTNER),
	validator(update),
	controller.update
);

route.get(
	"/partners/commissions/:platform",
	authenticate,
	authority(PermissionKey.VIEW_LIST_COMMISSION_PARTNER),
	controller.getAllByPlatform
);

route.get(
	"/partners/:partner_id/commissions/:platform",
	authenticate,
	authority(PermissionKey.VIEW_LIST_COMMISSION_PARTNER),
	controller.get
);

route.get(
	"/commissions",
	authenticate,
	authority(PermissionKey.VIEW_LIST_COMMISSION_PARTNER),
	controller.getAllByPartner
);

module.exports = route;

/*********************************************************************/

/**
 * @swagger
 * /web/partners/{partner_id}/commissions:
 *   get:
 *     summary: get list of partner commissions
 *     tags:
 *       - Commission
 *     description: get list of partner commissions by partner_id
 *     parameters:
 *       - in: path
 *         name: partner_id
 *         type: string
 *         required: true
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
 *                 "data": {
                        "items": [
                            {
                                "id": "b216a8ef-cc05-4d7b-b46a-a72c918d22c2",
                                "platform": "BTC",
                                "commission": 69,
                                "reward_address": "this_is_a_different_bitcoin_address",
                                "updated_by": 64,
                                "updated_at": "2020-04-09T14:47:41.017Z"
                            },
                            {
                                "id": "8f3d8b76-7915-493c-88f2-94ee074a56f1",
                                "platform": "ETC",
                                "commission": 68,
                                "reward_address": "this_is_a_more_different_etc_address",
                                "updated_by": 64,
                                "updated_at": "2020-04-09T14:47:37.884Z"
                            },
                            {
                                "id": "2366f28e-8802-47b6-b96e-1cbf467f6978",
                                "platform": "IRIS",
                                "commission": 70,
                                "reward_address": "",
                                "updated_by": 64,
                                "updated_at": "2020-04-09T14:47:41.801Z"
                            }
                        ],
                        "offset": 0,
                        "limit": 10,
                        "total": 3
                    }
 *             }
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

/*********************************************************************/

/**
 * @swagger
 * /web/partners/{partner_id}/commissions:
 *   post:
 *     summary: create/update partner commissions
 *     tags:
 *       - Commission
 *     description: update partner commission if commission has field `id`, otherwise create new commission
 *     parameters:
 *       - in: path
 *         name: partner_id
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for commision.
 *         schema:
 *            type: array
 *            example:
 *               {
                      "items": [
                          {
                              "id": "8f3d8b76-7915-493c-88f2-94ee074a56f1",
                              "platform": "ETC",
                              "commission": 68
                          },
                          {
                              "id": "b216a8ef-cc05-4d7b-b46a-a72c918d22c2",
                              "platform": "BTC",
                              "commission": 69
                          },
                          {
                              "platform": "IRIS",
                              "commission": 70
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
 *                 "data": [
                        {
                            "id": "2366f28e-8802-47b6-b96e-1cbf467f6978",
                            "platform": "IRIS",
                            "commission": 70,
                            "reward_address": "",
                            "updated_by": 64,
                            "updated_at": "2020-04-09T14:47:41.801Z"
                        },
                        {
                            "id": "8f3d8b76-7915-493c-88f2-94ee074a56f1",
                            "platform": "ETC",
                            "commission": 68,
                            "reward_address": "this_is_a_more_different_etc_address",
                            "updated_by": 64,
                            "updated_at": "2020-04-09T14:47:37.884Z"
                        },
                        {
                            "id": "b216a8ef-cc05-4d7b-b46a-a72c918d22c2",
                            "platform": "BTC",
                            "commission": 69,
                            "reward_address": "this_is_a_different_bitcoin_address",
                            "updated_by": 64,
                            "updated_at": "2020-04-09T14:47:41.017Z"
                        }
                    ]
 *             }
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

/*********************************************************************/

/**
 * @swagger
 * /web/partners/{partner_id}/commissions/histories:
 *   get:
 *     summary: get partner commission histories
 *     tags:
 *       - Commission
 *     description:
 *     parameters:
 *       - in: path
 *         name: partner_id
 *         type: string
 *         required: true
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
                                  "id": "b216a8ef-cc05-4d7b-b46a-a72c918d22c2",
                                  "platform": "BTC",
                                  "commission": 50,
                                  "reward_address": "this_is_a_bitcoin_address",
                                  "updated_by": 65,
                                  "updated_at": "2020-03-02T08:07:26.688Z"
                              },
                              {
                                  "id": "b216a8ef-cc05-4d7b-b46a-a72c918d22c2",
                                  "platform": "BTC",
                                  "commission": 50,
                                  "reward_address": "this_is_a_different_bitcoin_address",
                                  "updated_by": 65,
                                  "updated_at": "2020-03-02T08:08:12.140Z"
                              }
                          ],
                          "offset": 0,
                          "limit": 10,
                          "total": 2
                      }
 *             }
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
 *
 */

/*********************************************************************/

/**
 * @swagger
 * /web/partners/commissions/{platform}:
 *   get:
 *     summary: get list of partner commissions by platform
 *     tags:
 *       - Commission
 *     description: get list of partner commissions by by platform
 *     parameters:
 *       - in: path
 *         name: platform
 *         type: string
 *         required: true
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
 *                 "data": {
												"items": [
														{
																"id": "3c3ed477-a40e-439c-97ff-a404498ed5c2",
																"platform": "ETH",
																"commission": 20,
																"reward_address": "0x61179C42C57BFE59C5CecA25B3B66f6Ee3b15cD7",
																"updated_at": "2019-12-16T08:48:01.508Z"
														},
														{
																"id": "ac098ffd-1ff3-47c5-9244-38eda2dcfc59",
																"platform": "ETH",
																"commission": 20,
																"reward_address": "0x61179C42C57BFE59C5CecA25B3B66f6Ee3b15cD7",
																"updated_by": 0,
																"updated_at": "2019-12-16T08:48:01.508Z"
														}
												],
												"offset": 0,
												"limit": 10,
												"total": 2
										}
 *             }
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

/*********************************************************************/

/**
 * @swagger
 * /web/partners/{partner_id}/commissions/{platform}:
 *   get:
 *     summary: get commission by platform and partner_id
 *     tags:
 *       - Commission
 *     description: get commission by platform and partner_id
 *     parameters:
 *       - in: path
 *         name: partner_id
 *         type: string
 *         required: true
 *       - in: path
 *         name: platform
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
 *                 "data": [
												{
														"id": "3c3ed477-a40e-439c-97ff-a404498ed5c2",
														"platform": "ETH",
														"commission": 20,
														"reward_address": "0x61179C42C57BFE59C5CecA25B3B66f6Ee3b15cD7",
														"updated_at": "2019-12-16T08:48:01.508Z"
												},
												{
														"id": "ac098ffd-1ff3-47c5-9244-38eda2dcfc59",
														"platform": "ETH",
														"commission": 20,
														"reward_address": "0x61179C42C57BFE59C5CecA25B3B66f6Ee3b15cD7",
														"updated_by": 0,
														"updated_at": "2019-12-16T08:48:01.508Z"
												}
										]
 *             }
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

/*********************************************************************/

/**
 * @swagger
 * /web/commissions:
 *   get:
 *     summary: get list of partner commissions by partner
 *     tags:
 *       - Commission
 *     description: get list of partner commissions by partner
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
 *                 "data": {
												"items": [
														{
																"id": "f62634d4-30f9-11ea-aec2-2e728ce88125",
																"platform": "ATOM",
																"commission": 21,
																"reward_address": "cosmos1suvplzztw7kn4ntn9pcduxz2lxfjfy5akd3uk0",
																"updated_by": 10,
																"updated_at": "2020-04-11T08:51:33.275Z"
														},
														{
																"id": "3c3ed477-a40e-439c-97ff-a404498ed5c2",
																"platform": "ETH",
																"commission": 20,
																"reward_address": "0x61179C42C57BFE59C5CecA25B3B66f6Ee3b15cD7",
																"updated_by": 10,
																"updated_at": "2019-12-16T08:48:01.508Z"
														},
														{
																"id": "ac098ffd-1ff3-47c5-9244-38eda2dcfc59",
																"platform": "ETH",
																"commission": 20,
																"reward_address": "0x61179C42C57BFE59C5CecA25B3B66f6Ee3b15cD7",
																"updated_by": 10,
																"updated_at": "2019-12-16T08:48:01.508Z"
														},
														{
																"id": "24c39b32-2d13-11ea-978f-2e728ce88125",
																"platform": "IRIS",
																"commission": 20,
																"reward_address": "iaa16se3zaex588aqa6e0mgnps92a005mjm95d56jx",
																"updated_by": 10,
																"updated_at": "2020-02-06T09:12:43.073Z"
														}
												],
												"offset": 0,
												"limit": 10,
												"total": 4
										}
 *             }
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