const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const controller = require('./questionnaire.controller');
const validator = require('app/middleware/validator.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const {
  search,
  questionIdParam,
  update,
  create,
} = require('./validator');

const router = express.Router();

/* #region Search questions */
router.get('/questions',
  validator(search, 'query'),
  authenticate,
  authority(PermissionKey.SEARCH_QUESTIONS),
  controller.search
);

/**
* @swagger
* /web/questions:
*   get:
*     summary: Search questions
*     tags:
*       - Question
*     description: "Required permission: SEARCH_QUESTIONS."
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
*       - name: question_type
*         in: query
*         type: string
*       - name: category_type
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
                            "id": 1,
                            "title": "We want to hear about your opinion on cryptocurrency. A cryptocurrency is a digital or virtual currency designed to work as a medium of exchange. It uses cryptography to secure and verify transactions as well as to control the creation of new units of a particular cryptocurrency. How much, if at all, have you heard or read about cryptocurrencies such as Bitcoin or Ethereum?",
                            "question_type": "SINGLE_SELECTION",
                            "category_type": "ANSWER_NOW",
                            "points": 1,
                            "forecast_key": null,
                            "actived_flg": true,
                            "created_at": "2020-02-27T07:20:02.000Z",
                            "updated_at": "2020-02-27T07:20:02.000Z"
                        },
                        {
                            "id": 2,
                            "title": "Do you own cryptocurrency?",
                            "title_ja": "あなたは暗号通貨を所有していますか？",
                            "question_type": "SINGLE_SELECTION",
                            "category_type": "ANSWER_NOW",
                            "points": 1,
                            "actived_flg": true,
                            "created_at": "2020-02-27T07:20:02.000Z",
                            "updated_at": "2020-02-27T07:20:02.000Z"
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

/* #region Get question types*/
router.get('/questions/types',
  authenticate,
  controller.getQuestionTypes
);

/**
* @swagger
* /web/questions/types:
*   get:
*     summary: Get question types
*     tags:
*       - Question
*     description:
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
                        "value": "SINGLE_SELECTION",
                        "label": "SINGLE_SELECTION"
                    },
                    {
                        "value": "MULTIPLE_SELECTIONS",
                        "label": "MULTIPLE_SELECTIONS"
                    },
                    {
                        "value": "OPEN_ENDED",
                        "label": "OPEN_ENDED"
                    },
                    {
                        "value": "NUMERIC_OPEN_ENDED",
                        "label": "NUMERIC_OPEN_ENDED"
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
/* #endregion */

/* #region Get question categories*/
router.get('/questions/categories',
  authenticate,
  controller.getQuestionCategories
);

/**
* @swagger
* /web/questions/categories:
*   get:
*     summary: Get question categories
*     tags:
*       - Question
*     description:
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
                        "value": "ANSWER_NOW",
                        "label": "ANSWER_NOW"
                    },
                    {
                        "value": "FORECAST",
                        "label": "FORECAST"
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
/* #endregion */

/* #region Get question details */
router.get('/questions/:questionId',
  validator(questionIdParam, 'params'),
  authenticate,
  authority(PermissionKey.VIEW_QUESTION_DETAILS),
  controller.getDetails
);

/**
* @swagger
* /web/questions/:questionId:
*   get:
*     summary: Get question details
*     tags:
*       - Question
*     description: "Required permission: VIEW_QUESTION_DETAILS."
*     parameters:
*       - name: questionId
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
                    "title": "Do you own cryptocurrency?",
                    "title_ja": "あなたは暗号通貨を所有していますか？",
                    "question_type": "SINGLE_SELECTION",
                    "category_type": "ANSWER_NOW",
                    "content_ja": null,
                    "points": 1,
                    "forecast_key": null,
                    "actived_flg": true,
                    "answers": [
                        {
                            "id": 5,
                            "question_id": 2,
                            "text": "Yes",
                            "text_jp": "はい",
                            "is_correct_flg": true,
                            "createdAt": "2020-02-27T07:20:02.000Z",
                            "updatedAt": "2020-02-27T07:20:02.000Z"
                        },
                        {
                            "id": 6,
                            "question_id": 2,
                            "text": "No",
                            "text_jp": "番号",
                            "is_correct_flg": false,
                            "createdAt": "2020-02-27T07:20:02.000Z",
                            "updatedAt": "2020-02-27T07:20:02.000Z"
                        }
                    ],
                    "created_at": "2020-02-27T07:20:02.000Z",
                    "updated_at": "2020-02-27T07:20:02.000Z"
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

/* #region Create question */
router.post('/questions/',
  validator(create, 'body'),
  authenticate,
  authority(PermissionKey.CREATE_QUESTION),
  controller.create
);

/**
* @swagger
* /web/questions:
*   post:
*     summary: Create question
*     tags:
*       - Question
*     description: "Required permission: CREATE_QUESTION."
*     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                      "title": "Terms and Conditions update",
                      "title_ja": "In its the majority of standard terms: if YouTube isn’t making money off you, the company can erase your account. The platform’s existing terms of service do not include this language.YouTube is updating their Terms of Service on 10 December 2019. It presents an awful possibility for the future of creators on the platform. It seems they will be able to terminate your channel if it’s “no longer commercially viable.Check it out here: https://t.co/UrVpXmq4k5",
                      "question_type": "SINGLE_SELECTION",
                      "points": 1,
                      "actived_flg": true,
                      "answers": [
                          {
                              "text": "A lot",
                              "text_ja": "",
                              "is_correct_flg": true
                          },
                          {
                              "text": "Some",
                              "text_ja": "",
                              "is_correct_flg": false
                          },
                          {
                              "text": "Not much",
                              "text_ja": "",
                              "is_correct_flg": false
                          },
                          {
                              "text": "Just hearing about it now in this survey",
                              "text_ja": "",
                              "is_correct_flg": false
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
                "data": {
                    "id": 12,
                    "title": "Terms and Conditions update",
                    "title_ja": "In its the majority of standard terms: if YouTube isn’t making money off you, the company can erase your account. The platform’s existing terms of service do not include this language.YouTube is updating their Terms of Service on 10 December 2019. It presents an awful possibility for the future of creators on the platform. It seems they will be able to terminate your channel if it’s “no longer commercially viable.Check it out here: https://t.co/UrVpXmq4k5",
                    "question_type": "SINGLE_SELECTION",
                    "category_type": "ANSWER_NOW",
                    "content_ja": null,
                    "points": 1,
                    "forecast_key": null,
                    "actived_flg": true,
                    "answers": [
                        {
                            "id": 35,
                            "text": "A lot",
                            "text_ja": "",
                            "is_correct_flg": true,
                            "question_id": 12,
                            "updatedAt": "2020-10-27T08:58:58.009Z",
                            "createdAt": "2020-10-27T08:58:58.009Z"
                        },
                        {
                            "id": 36,
                            "text": "Some",
                            "text_ja": "",
                            "is_correct_flg": false,
                            "question_id": 12,
                            "updatedAt": "2020-10-27T08:58:58.009Z",
                            "createdAt": "2020-10-27T08:58:58.009Z"
                        },
                        {
                            "id": 37,
                            "text": "Not much",
                            "text_ja": "",
                            "is_correct_flg": false,
                            "question_id": 12,
                            "updatedAt": "2020-10-27T08:58:58.009Z",
                            "createdAt": "2020-10-27T08:58:58.009Z"
                        },
                        {
                            "id": 38,
                            "text": "Just hearing about it now in this survey",
                            "text_ja": "",
                            "is_correct_flg": false,
                            "question_id": 12,
                            "updatedAt": "2020-10-27T08:58:58.009Z",
                            "createdAt": "2020-10-27T08:58:58.009Z"
                        }
                    ],
                    "created_at": "2020-10-27T08:58:57.797Z",
                    "updated_at": "2020-10-27T08:58:57.797Z"
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

/* #region Update question */
router.put('/questions/:questionId',
  validator(questionIdParam, 'params'),
  validator(update, 'body'),
  authenticate,
  authority(PermissionKey.UPDATE_QUESTION),
  controller.update
);

/**
* @swagger
* /web/questions/:questionId:
*   put:
*     summary: Update question
*     tags:
*       - Question
*     description: "Required permission: UPDATE_QUESTION."
*     parameters:
*       - name: questionId
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
                      "title": "Terms and Conditions update",
                      "content": "In its the majority of standard terms: if YouTube isn’t making money off you, the company can erase your account. The platform’s existing terms of service do not include this language.YouTube is updating their Terms of Service on 10 December 2019. It presents an awful possibility for the future of creators on the platform. It seems they will be able to terminate your channel if it’s “no longer commercially viable.Check it out here: https://t.co/UrVpXmq4k5",
                      "description": "...",
                      "title_ja": "利用規約の更新",
                      "content_ja": "「ほとんどの標準的な条件では、YouTubeがあなたに利益をもたらさない場合、会社はあなたのアカウントを消去することができます。プラットフォームの既存の利用規約にはこの言語は含まれていません。YouTubeは2019年12月10日に利用規約を更新しています。 プラットフォーム上のクリエイターの将来に大きな可能性をもたらします。「商業的に実行できなくなった場合、チャンネルを終了できるようです。こちらをご覧ください: https://t.co/UrVpXmq4k5",
                      "type": "SYSTEM",
                      "event": "NEW_INFORMATION",
                      "actived_flg": false,
                      "sent_all_flg": true
*                  }
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
                    "description": "...",
                    "title_ja": "利用規約の更新",
                    "content_ja": "「ほとんどの標準的な条件では、YouTubeがあなたに利益をもたらさない場合、会社はあなたのアカウントを消去することができます。プラットフォームの既存の利用規約にはこの言語は含まれていません。YouTubeは2019年12月10日に利用規約を更新しています。 プラットフォーム上のクリエイターの将来に大きな可能性をもたらします。「商業的に実行できなくなった場合、チャンネルを終了できるようです。こちらをご覧ください: https://t.co/UrVpXmq4k5",
                    "type": "SYSTEM",
                    "event": "NEW_INFORMATION",
                    "sent_all_flg": true,
                    "actived_flg": false,
                    "created_at": "2020-09-28T08:52:50.582Z",
                    "updated_at": "2020-09-28T10:32:37.710Z"
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

/* #region Delete question */
router.delete('/questions/:questionId',
  validator(questionIdParam, 'params'),
  authenticate,
  authority(PermissionKey.DELETE_QUESTION),
  controller.delete
);

/**
* @swagger
* /web/questions/:questionId:
*   delete:
*     summary: Delete question
*     tags:
*       - Question
*     description: "Required permission: DELETE_QUESTION."
*     parameters:
*       - name: questionId
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
