const express = require('express');
const config = require('app/config');
const validator = require("app/middleware/validator.middleware");
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./receiving-address.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const authority = require('app/middleware/authority.middleware');
const router = express.Router();

router.get(
  '/receiving-address',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_VIEW_RECEIVING_ADDRESS),
  controller.getAll
);

router.post(
  '/receiving-address',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_ADD_RECEIVING_ADDRESS),
  controller.create
);

router.get(
  '/receiving-address/:id',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_VIEW_RECEIVING_ADDRESS_DETAIL),
  controller.get
);

router.put(
  '/receiving-address/:id/active',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_UPDATE_RECEIVING_ADDRESS),
  controller.active
);

router.put(
  '/receiving-address/:id/disable',
  authenticate,
  authority(PermissionKey.MEMBERSHIP_UPDATE_RECEIVING_ADDRESS),
  controller.disable
);

module.exports = router;


/**
* @swagger
* /web/membership/receiving-address:
*   get:
*     summary: get list receiving address
*     tags:
*       - Membership Receiving Address
*     description: get list receiving address
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
                      "id" : 1,
                      "currency_symbol" : "ATOM",
                      "wallet_address" : "cosmos1xxkueklal9vejv9unqu80w9vptyepfa95pd53u",
                      "actived_flg" : true
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

/**
* @swagger
* /web/membership/receiving-address/{id}:
*   get:
*     summary: get receiving address
*     tags:
*       - Membership Receiving Address
*     description: get receiving address
*     parameters:
*       - name: id
*         in: path
*         type: number
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data":
                    {
                      "id" : 1,
                      "currency_symbol" : "ATOM",
                      "wallet_address" : "cosmos1xxkueklal9vejv9unqu80w9vptyepfa95pd53u",
                      "actived_flg" : true
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
* /web/membership/receiving-address:
*   post:
*     summary: create receiving address
*     tags:
*       - Membership Receiving Address
*     description: create receiving address
*     parameters:
*       - name: data
*         in: body
*         required: true
*         description: submit data JSON.
*         schema:
*            type: object
*            example:
*                  {
                      "platform": "ATOM",
                      "address" : "cosmos1xxkueklal9vejv9unqu80w9vptyepfa95pd53u"
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



/**
* @swagger
* /web/membership/receiving-address/{id}/active:
*   put:
*     summary: active receiving address
*     tags:
*       - Membership Receiving Address
*     description: active receiving address
*     parameters:
*       - name: id
*         in: path
*         type: number
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data":
                    {
                      "id" : 1,
                      "currency_symbol" : "ATOM",
                      "wallet_address" : "cosmos1xxkueklal9vejv9unqu80w9vptyepfa95pd53u",
                      "actived_flg" : true
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
* /web/membership/receiving-address/{id}/disable:
*   put:
*     summary: active receiving address
*     tags:
*       - Membership Receiving Address
*     description: active receiving address
*     parameters:
*       - name: id
*         in: path
*         type: number
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data":
                    {
                      "id" : 1,
                      "currency_symbol" : "ATOM",
                      "wallet_address" : "cosmos1xxkueklal9vejv9unqu80w9vptyepfa95pd53u",
                      "actived_flg" : true
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