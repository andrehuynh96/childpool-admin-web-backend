const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./survey.controller');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const validator = require('app/middleware/validator.middleware');
const { create, update } = require('./validator');

const router = express.Router();

/* #region Search Survey */

router.get('/surveys',
  authenticate,
  authority(PermissionKey.VIEW_LIST_SURVEY),
  controller.search
);

/**
* @swagger
* /web/surveys:
*   get:
*     summary: Search survey
*     tags:
*       - Survey
*     description:
*     parameters:
*       - name: offset
*         in: query
*         type: integer
*         format: int32
*       - name: limit
*         in: query
*         type: integer
*       - name: history
*         in: query
*         type: integer
*       - name: name
*         in: query
*         type: string
*       - name: from_date
*         in: query
*         type: date
*       - name: to_date
*         in: query
*         type: date
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
                            "id": "d6c7c1ea-c67d-4287-9cc5-d528d4e9a33c",
                            "name": "survey 2",
                            "content": "test create survey",
                            "content_ja": "",
                            "start_date": "2020-11-16T04:51:40.739Z",
                            "end_date": "2020-11-20T04:51:40.739Z",
                            "activated_flg": false,
                            "description": "",
                            "point": 100,
                            "estimate_time": 60,
                            "deleted_flg": false,
                            "created_by": 32,
                            "updated_by": 32,
                            "createdAt": "2020-11-16T07:50:39.001Z",
                            "updatedAt": "2020-11-16T07:50:39.001Z"
                        },
                        {
                            "id": "40e53398-7fd3-4b6e-8ad0-d7ba35ae9c4e",
                            "name": "survey 1",
                            "content": "test create survey",
                            "content_ja": "",
                            "start_date": "2020-11-16T04:51:40.739Z",
                            "end_date": "2020-11-20T04:51:40.739Z",
                            "activated_flg": false,
                            "description": "",
                            "point": 100,
                            "estimate_time": 60,
                            "deleted_flg": false,
                            "created_by": 32,
                            "updated_by": 32,
                            "createdAt": "2020-11-16T07:23:17.087Z",
                            "updatedAt": "2020-11-16T08:17:12.917Z"
                        }
                    ],
                    "limit": 10,
                    "offset": 0,
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

router.get('/surveys/options',
  controller.getOptions
);

/* #region Get Survey detail */

router.get('/surveys/:id',
  authenticate,
  authority(PermissionKey.VIEW_SURVEY_DETAIL),
  controller.details
);
/**
* @swagger
* /web/surveys/{id}:
*   get:
*     summary: Get survey detail
*     tags:
*       - Survey
*     description:
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
                    "survey": {
                        "id": "40e53398-7fd3-4b6e-8ad0-d7ba35ae9c4e",
                        "name": "survey 1",
                        "content": "test create survey",
                        "content_ja": "",
                        "start_date": "2020-11-16T04:51:40.739Z",
                        "end_date": "2020-11-20T04:51:40.739Z",
                        "activated_flg": false,
                        "description": "",
                        "point": 100,
                        "estimate_time": 60,
                        "deleted_flg": false,
                        "created_by": 32,
                        "updated_by": 32,
                        "createdAt": "2020-11-16T07:23:17.087Z",
                        "updatedAt": "2020-11-16T08:17:12.917Z"
                    },
                    "questions": [
                        {
                            "id": 35,
                            "title": "Are you kidding me?",
                            "title_ja": "",
                            "question_type": "OPEN_ENDED",
                            "category_type": "ANSWER_NOW",
                            "points": 1,
                            "forecast_key": null,
                            "actived_flg": true,
                            "deleted_flg": false,
                            "sub_type": "SURVEY",
                            "Answers": [
                                {
                                    "id": 149,
                                    "question_id": 35,
                                    "text": "yes",
                                    "text_ja": "",
                                    "is_correct_flg": false,
                                    "createdAt": "2020-11-16T07:23:17.977Z",
                                    "updatedAt": "2020-11-16T08:04:54.213Z"
                                }
                            ],
                            "created_at": "2020-11-16T07:23:17.724Z",
                            "updated_at": "2020-11-16T08:17:13.378Z"
                        },
                        {
                            "id": 36,
                            "title": "question 2 update",
                            "title_ja": "",
                            "question_type": "OPEN_ENDED",
                            "category_type": "ANSWER_NOW",
                            "points": 1,
                            "actived_flg": true,
                            "deleted_flg": false,
                            "sub_type": "SURVEY",
                            "Answers": [
                                {
                                    "id": 150,
                                    "question_id": 36,
                                    "text": "yes",
                                    "text_ja": "",
                                    "is_correct_flg": true,
                                    "createdAt": "2020-11-16T07:23:18.366Z",
                                    "updatedAt": "2020-11-16T08:04:54.775Z"
                                }
                            ],
                            "created_at": "2020-11-16T07:23:18.139Z",
                            "updated_at": "2020-11-16T08:17:13.378Z"
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
/* #endregion */

/* #region Create Survey */

router.post('/surveys',
  authenticate,
  validator(create),
  authority(PermissionKey.CREATE_SURVEY),
  controller.createSurvey
);
/**
* @swagger
* /web/surveys:
*   post:
*     summary: Create survey
*     tags:
*       - Survey
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
                      "survey": {
                            "name":"survey 9",
                            "content": "test create survey",
                            "content_ja": "",
                            "start_date": "2020-11-16T04:51:40.739Z",
                            "end_date": "2020-11-20T04:51:40.739Z",
                            "description": "",
                            "status": "DRAFT",
                            "type": "SURVEY",
                            "title": "create new survey",
                            "title_ja": "",
                            "silver_membership_point": 10,
                            "gold_membership_point": 20,
                            "platinum_membership_point": 30
                        },
                      "questions": [
                          {
                              "title": "Are you kidding me?",
                              "title_ja": "",
                              "question_type": "OPEN_ENDED",
                              "actived_flg": true,
                              "answers": [
                                  {
                                      "text":"yes",
                                      "text_ja":"",
                                      "is_correct_flg": true
                                  }
                              ]
                          },
                          {
                              "title": "question 2",
                              "title_ja": "",
                              "question_type": "OPEN_ENDED",
                              "actived_flg": true,
                              "answers": [
                                  {
                                      "text":"yes",
                                      "text_ja":"",
                                      "is_correct_flg": true
                                  }
                              ]
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
/* #endregion */

/* #region Update Survey */
router.put('/surveys/:id',
  authenticate,
  validator(update),
  authority(PermissionKey.UPDATE_SURVEY),
  controller.updateSurvey
);

/**
* @swagger
* /web/surveys/{id}:
*   put:
*     summary: Update survey
*     tags:
*       - Survey
*     description:
*     parameters:
*       - name: id
*         in: path
*         required: true
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                    "survey": {
                        "name":"survey 9",
                        "content": "test update survey",
                        "content_ja": "",
                        "start_date": "2020-11-16T04:51:40.739Z",
                        "end_date": "2020-11-20T04:51:40.739Z",
                        "description": "",
                        "status": "DRAFT",
                        "type": "SURVEY",
                        "title": "update survey 9",
                        "title_ja": "",
                        "silver_membership_point": 100,
                        "gold_membership_point": 200,
                        "platinum_membership_point": 300
                    },
                    "questions": [
                        {
                            "title": "question 1 survey 9",
                            "title_ja": "",
                            "question_type": "OPEN_ENDED",
                            "answers": [
                                {
                                    "text":"yes create",
                                    "text_ja":"",
                                    "is_correct_flg": true
                                }
                            ]
                        },
                        {
                            "title": "question 2 survey 9",
                            "title_ja": "",
                            "question_type": "OPEN_ENDED",
                            "answers": [
                                {
                                    "text":"yes create",
                                    "text_ja":"",
                                    "is_correct_flg": true
                                }
                            ]
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
/* #endregion */

/* #region Delete Survey */
router.delete('/surveys/:id',
  authenticate,
  authority(PermissionKey.DELETE_SURVEY),
  controller.deleteSurvey
);

/**
* @swagger
* /web/surveys/{id}:
*   delete:
*     summary: Delete survey
*     tags:
*       - Survey
*     description:
*     parameters:
*       - name: id
*         in: path
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
