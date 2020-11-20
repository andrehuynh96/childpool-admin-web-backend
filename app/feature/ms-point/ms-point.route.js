const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./ms-point.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const validator = require("app/middleware/validator.middleware");
const {
  search,
  updateModeSettings,
  updateClaimingSettings,
  updateStakingSettings,
  updateExchangeSettings,
  updateUpgradeMembershipSettings,
  updateSurveySettings,
} = require('./validator');

const router = express.Router();

/* #region  Search claim points */
/**
 * @swagger
 * /web/claim-points:
 *   get:
 *     summary: Search claim points
 *     tags:
 *       - MS Point
 *     description:
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
 *       - name: email
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
                              "id": "1",
                              "member": {
                                  "id": "71b18ecd-f0c9-428c-b882-13752332021d",
                                  "email": "hungtv+150035@blockchainlabs.asia"
                              },
                              "member_id": "71b18ecd-f0c9-428c-b882-13752332021d",
                              "status": "Claim",
                              "amount": "100",
                              "currency_symbol": "MS_POINT",
                              "system_type": "MEMBERSHIP",
                              "created_at": "2020-07-21T08:51:20.000Z",
                              "updated_at": "2020-07-21T08:51:20.000Z"
                          },
                          {
                              "id": "2",
                              "member": {
                                  "id": "71b18ecd-f0c9-428c-b882-13752332021d",
                                  "email": "hungtv+150035@blockchainlabs.asia"
                              },
                              "member_id": "71b18ecd-f0c9-428c-b882-13752332021d",
                              "status": "Claim",
                              "amount": "100",
                              "currency_symbol": "MS_POINT",
                              "system_type": "MEMBERSHIP",
                              "created_at": "2020-07-21T08:51:20.000Z",
                              "updated_at": "2020-07-21T08:51:20.000Z"
                          },
                          {
                              "id": "3",
                              "member": {
                                  "id": "71b18ecd-f0c9-428c-b882-13752332021d",
                                  "email": "hungtv+150035@blockchainlabs.asia"
                              },
                              "member_id": "71b18ecd-f0c9-428c-b882-13752332021d",
                              "status": "Claim",
                              "amount": "100",
                              "currency_symbol": "MS_POINT",
                              "system_type": "MEMBERSHIP",
                              "created_at": "2020-07-21T08:51:20.000Z",
                              "updated_at": "2020-07-21T08:51:20.000Z"
                          },
                          {
                              "id": "4",
                              "member": {
                                  "id": "71b18ecd-f0c9-428c-b882-13752332021d",
                                  "email": "hungtv+150035@blockchainlabs.asia"
                              },
                              "member_id": "71b18ecd-f0c9-428c-b882-13752332021d",
                              "status": "Claim",
                              "amount": "100",
                              "currency_symbol": "MS_POINT",
                              "system_type": "MEMBERSHIP",
                              "created_at": "2020-07-21T08:51:20.000Z",
                              "updated_at": "2020-07-21T08:51:20.000Z"
                          }
                      ],
                      "offset": 0,
                      "limit": 25,
                      "total": 8
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

router.get(
  '/claim-points',
  authenticate,
  authority(PermissionKey.VIEW_CLAIM_MS_POINT_HISTORIES),
  validator(search, 'query'),
  controller.search
);
/* #endregion */

/* #region Get claim points status */
/**
 * @swagger
 * /web/claim-point-statuses:
 *   get:
 *     summary: get claim point status
 *     tags:
 *       - MS Point
 *     description:
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
                          "label": "PENDING",
                          "value": "PENDING"
                      },
                      {
                          "label": "APPROVED",
                          "value": "APPROVED"
                      },
                      {
                          "label": "CANCELED",
                          "value": "CANCELED"
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

router.get(
  '/claim-point-statuses',
  authenticate,
  controller.getStatuses
);
/* #endregion */

/* #region Get claim points actions */
/**
 * @swagger
 * /web/claim-point-actions:
 *   get:
 *     summary: get claim point action
 *     tags:
 *       - MS Point
 *     description:
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
                        "label": "CLAIM",
                        "value": "CLAIM"
                    },
                    {
                        "label": "STAKING",
                        "value": "STAKING"
                    },
                    {
                        "label": "UPGRADE_MEMBERSHIP",
                        "value": "UPGRADE_MEMBERSHIP"
                    },
                    {
                        "label": "EXCHANGE",
                        "value": "EXCHANGE"
                    },
                    {
                        "label": "SWAP_TO_TOKEN",
                        "value": "SWAP_TO_TOKEN"
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

router.get(
  '/claim-point-actions',
  authenticate,
  controller.getActions
);
/* #endregion */

/* #region Get phases */
/**
 * @swagger
 * /web/ms-point/phases:
 *   get:
 *     summary: Get phases
 *     tags:
 *       - MS Point
 *     description:
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
                        "label": "phase_1",
                        "value": "Phase 1"
                    },
                    {
                        "label": "phase_3",
                        "value": "Phase 3"
                    },
                    {
                        "label": "phase_4",
                        "value": "Phase 4"
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

router.get(
  '/ms-point/phases',
  authenticate,
  controller.getPhases
);
/* #endregion */

/* #region Get MS points settings */
/**
 * @swagger
 * /web/ms-point/settings:
 *   get:
 *     summary: Get MS points settings
 *     tags:
 *       - MS Point
 *     description:
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
                      "ms_point_mode": "phase_1",
                      "ms_point_delay_time_in_seconds": 12,
                      "ms_point_staking_is_enabled": true,
                      "ms_point_upgrading_membership_is_enabled": true,
                      "ms_point_exchange_is_enabled": true,
                      "ms_point_exchange_mininum_value_in_usdt": 100,
                      "membership_types": [
                          {
                              "id": "f345042c-8e60-4357-98bc-41ea1136ebd0",
                              "name": "Silver",
                              "price": "0",
                              "currency_symbol": "USD",
                              "type": "Free",
                              "is_enabled": true,
                              "display_order": 1,
                              "claim_points": 1,
                              "staking_points": null,
                              "upgrade_membership_points": null,
                              "exchange_points": null,
                              "created_at": "2020-07-21T08:51:20.271Z",
                              "updated_at": "2020-10-28T10:46:47.750Z"
                          },
                          {
                              "id": "8600c494-91f4-4186-abd8-4197c72c0f43",
                              "name": "Gold",
                              "price": "10",
                              "currency_symbol": "USD",
                              "type": "Paid",
                              "is_enabled": true,
                              "display_order": 2,
                              "claim_points": 5,
                              "created_at": "2020-07-21T08:51:20.271Z",
                              "updated_at": "2020-10-28T10:46:47.757Z"
                          },
                          {
                              "id": "6f272abb-d8a1-4a5d-a9d3-16718a8d0975",
                              "name": "Platinum",
                              "price": "100",
                              "currency_symbol": "USD",
                              "type": "Paid",
                              "is_enabled": true,
                              "display_order": 4,
                              "claim_points": 1,
                              "created_at": "2020-07-21T08:51:20.271Z",
                              "updated_at": "2020-10-28T10:46:47.767Z"
                          }
                      ]
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

router.get(
  '/ms-point/settings',
  authenticate,
  authority(PermissionKey.VIEW_MS_POINT_SETTINGS),
  controller.getSettings
);
/* #endregion */

/* #region Update MS points Mode*/
/**
 * @swagger
 * /web/ms-point/settings/mode':
 *   put:
 *     summary: Update MS points mode
 *     tags:
 *       - MS Point
 *     description:
 *     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                      "ms_point_delay_time_in_seconds": 12,
                      "membership_types": [
                          {
                              "id": "f345042c-8e60-4357-98bc-41ea1136ebd0",
                              "claim_points": 2
                          },
                          {
                              "id": "8600c494-91f4-4186-abd8-4197c72c0f43",
                              "claim_points": 6
                          },
                          {
                              "id": "6f272abb-d8a1-4a5d-a9d3-16718a8d0975",
                              "claim_points": 12
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

router.put(
  '/ms-point/settings/mode',
  authenticate,
  authority(PermissionKey.UPDATE_MS_POINT_SETTINGS),
  validator(updateModeSettings),
  controller.updateModeSettings
);
/* #endregion */

/* #region Update MS points settings for claiming*/
/**
 * @swagger
 * /web/ms-point/settings/claiming':
 *   put:
 *     summary: Update MS points settings for claiming
 *     tags:
 *       - MS Point
 *     description:
 *     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                      "ms_point_delay_time_in_seconds": 12,
                      "membership_types": [
                          {
                              "id": "f345042c-8e60-4357-98bc-41ea1136ebd0",
                              "claim_points": 2
                          },
                          {
                              "id": "8600c494-91f4-4186-abd8-4197c72c0f43",
                              "claim_points": 6
                          },
                          {
                              "id": "6f272abb-d8a1-4a5d-a9d3-16718a8d0975",
                              "claim_points": 12
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

router.put(
  '/ms-point/settings/claiming',
  authenticate,
  authority(PermissionKey.UPDATE_MS_POINT_SETTINGS),
  validator(updateClaimingSettings),
  controller.updateClaimingSettings
);
/* #endregion */

/* #region Update MS points settings for staking*/
/**
 * @swagger
 * /web/ms-point/settings/staking':
 *   put:
 *     summary: Update MS points settings for staking
 *     tags:
 *       - MS Point
 *     description:
 *     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                      "ms_point_staking_is_enabled": false,
                      "membership_types": [
                          {
                              "id": "f345042c-8e60-4357-98bc-41ea1136ebd0",
                              "points": 12
                          },
                          {
                              "id": "8600c494-91f4-4186-abd8-4197c72c0f43",
                              "points": 16
                          },
                          {
                              "id": "6f272abb-d8a1-4a5d-a9d3-16718a8d0975",
                              "points": 112
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

router.put(
  '/ms-point/settings/staking',
  authenticate,
  authority(PermissionKey.UPDATE_MS_POINT_SETTINGS),
  validator(updateStakingSettings),
  controller.updateStakingSettings
);
/* #endregion */

/* #region Update MS points settings for exchange*/
/**
 * @swagger
 * /web/ms-point/settings/exchange':
 *   put:
 *     summary: Update MS points settings for exchange
 *     tags:
 *       - MS Point
 *     description:
 *     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                      "ms_point_staking_is_enabled": false,
                      "membership_types": [
                          {
                              "id": "f345042c-8e60-4357-98bc-41ea1136ebd0",
                              "points": 12
                          },
                          {
                              "id": "8600c494-91f4-4186-abd8-4197c72c0f43",
                              "points": 16
                          },
                          {
                              "id": "6f272abb-d8a1-4a5d-a9d3-16718a8d0975",
                              "points": 112
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

router.put(
  '/ms-point/settings/exchange',
  authenticate,
  authority(PermissionKey.UPDATE_MS_POINT_SETTINGS),
  validator(updateExchangeSettings),
  controller.updateExchangeSettings
);
/* #endregion */

/* #region Update MS points settings for upgrading membership type */
/**
 * @swagger
 * /web/ms-point/settings/upgrading-membership-type':
 *   put:
 *     summary: Update MS points settings for upgrading membership type
 *     tags:
 *       - MS Point
 *     description:
 *     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                      "ms_point_upgrading_membership_is_enabled": true,
                      "membership_types": [
                          {
                              "id": "f345042c-8e60-4357-98bc-41ea1136ebd0",
                              "points": 2110
                          },
                          {
                              "id": "8600c494-91f4-4186-abd8-4197c72c0f43",
                              "points": 6110
                          },
                          {
                              "id": "6f272abb-d8a1-4a5d-a9d3-16718a8d0975",
                              "points": 12110
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

router.put(
  '/ms-point/settings/upgrading-membership-type',
  authenticate,
  authority(PermissionKey.UPDATE_MS_POINT_SETTINGS),
  validator(updateUpgradeMembershipSettings),
  controller.updateUpgradeMembershipSettings
);
/* #endregion */

/* #region Update MS points settings for survey */
/**
 * @swagger
 * /web/ms-point/settings/survey':
 *   put:
 *     summary: Update MS points settings for survey
 *     tags:
 *       - MS Point
 *     description:
 *     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                      "ms_point_survey_is_enabled": true,
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

router.put(
  '/ms-point/settings/survey',
  authenticate,
  authority(PermissionKey.UPDATE_MS_POINT_SETTINGS),
  validator(updateSurveySettings),
  controller.updateSurveySettings
);
/* #endregion */

module.exports = router;
