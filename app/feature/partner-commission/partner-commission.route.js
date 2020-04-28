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
																"id": "f62634d4-30f9-11ea-aec2-2e728ce88125",
                                "platform": "ATOM",
                                "symbol": "ATOM",
                                "commission": 69,
                                "reward_address": "cosmos1suvplzztw7kn4ntn9pcduxz2lxfjfy5akd3uk0",
                                "staking_platform_id": "cba566c6-35ae-11ea-978f-2e728ce88125",
                                "updated_by": 64,
                                "updated_at": "2020-04-22T04:07:27.929Z",
                                "partner_updated_by": "ed483de6-2d14-11ea-978f-2e728ce88125"
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
														"platform": "ETH",
														"commission": 69,
														"reward_address": "",
														"staking_platform_id": ""
												},
												{
														"id": "b216a8ef-cc05-4d7b-b46a-a72c918d22c2",
														"platform": "BTC",
														"commission": 69,
														"reward_address": "",
														"staking_platform_id": ""
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
														"id": "8f3d8b76-7915-493c-88f2-94ee074a56f1",
                            "platform": "ETC",
                            "symbol": "ATOM",
														"commission": 69,
														"reward_address": "this_is_a_more_different_etc_address",
														"updated_by": 10,
														"updated_by_user_name": "testttttttttt"
												},
												{
														"id": "b216a8ef-cc05-4d7b-b46a-a72c918d22c2",
                            "platform": "BTC",
                            "symbol": "ATOM",
														"commission": 69,
														"reward_address": "this_is_a_different_bitcoin_address",
														"updated_by": 10,
														"updated_by_user_name": "testttttttttt"
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
																"id": "c8f44aac-8801-49e1-8f18-f87328801bb1",
                                "platform": "BTC",
                                "symbol": "ATOM",
																"commission": 12,
																"reward_address": "",
																"staking_platform_id": "96a29602-257d-4041-85c4-ea0fb17e0e67",
																"updated_by": 10,
																"updated_by_user_name": "testttttttttt"
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
 *     description: get list of partner commissions by platform
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
                              "symbol": "ATOM",
															"commission": 68,
															"reward_address": "0x61179C42C57BFE59C5CecA25B3B66f6Ee3b15cD7",
															"staking_platform_id": "83675dbc-7a2e-40b8-a97b-867d1fa90319",
															"updated_by": 64,
															"updated_by_user_name": "testttttttttt"
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
                            "symbol": "ATOM",
                            "commission": 68,
                            "reward_address": "0x61179C42C57BFE59C5CecA25B3B66f6Ee3b15cD7",
                            "staking_platform_id": "83675dbc-7a2e-40b8-a97b-867d1fa90319",
                            "updated_by": 64,
                            "updated_by_user_name": "testttttttttt"
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
									"data": {
											"items": [
													{
														"id": "3c3ed477-a40e-439c-97ff-a404498ed5c2",
                            "platform": "ETH",
                            "symbol": "ATOM",
                            "commission": 68,
                            "reward_address": "0x61179C42C57BFE59C5CecA25B3B66f6Ee3b15cD7",
                            "staking_platform_id": "83675dbc-7a2e-40b8-a97b-867d1fa90319",
                            "updated_by": 64
													}
											],
											"offset": 0,
											"limit": 10,
											"total": 4
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