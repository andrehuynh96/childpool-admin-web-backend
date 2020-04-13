const express = require('express');
const validator = require('app/middleware/validator.middleware');
const { create, update } = require('./validator');
const controller = require('./change-reward-address.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.post(
    '/commissions/:commission_id/requests',
    authenticate,
    authority(PermissionKey.CREATE_CHANGE_REWARD_ADDRESS_REQUEST),
    validator(create),
    controller.create
);
router.post(
    '/commissions/requests',
    authenticate,
    authority(PermissionKey.UPDATE_CHANGE_REWARD_ADDRESS_REQUEST),
    validator(update),
    controller.update
);
  
module.exports = router;

/*********************************************************************/
  
/**
 * @swagger
 * /web/commissions/{commission_id}/requests:
 *   post:
 *     summary: create request change reward address
 *     tags:
 *       - Requests
 *     description:
 *     parameters:
 *       - in: path
 *         name: commission_id
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for update.
 *         schema:
 *            type: object
 *            required:
 *            - reward_address
 *            example:
 *               {    
                    "reward_address": "iaa16se3zaex588aqa6e0mgnps92a005mjm95d56jx"
                }
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data": true
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

/**
 * @swagger
 * /web/commissions/requests:
 *   post:
 *     summary: update request change reward address
 *     tags:
 *       - Requests
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for update.
 *         schema:
 *            type: object
 *            required:
 *            - status
 *            - token
 *            example:
 *               {     
                    "status": 2,
                    "token": "OWY4YzBlOTgtZmY5NS00M2Y1LTk4M2YtY2M0MzAzNjRlNDFi"
                }
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data": true
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