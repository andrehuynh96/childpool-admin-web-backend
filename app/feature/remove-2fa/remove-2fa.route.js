const express = require('express');
const controller = require('./remove-2fa.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const PermissionKey = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.put(
  '/members/:memberId/remove-2fa',
  authenticate,
  authority(PermissionKey.REMOVE_2FA),
  controller
);

module.exports = router;
/**
 * @swagger
 * /members/{memberId}/remove-2fa:
 *   put:
 *     summary: remove 2fa
 *     tags:
 *       - Members
 *     description: update remove 2fa
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to update.
 *         schema:
 *            type: object
 *            required:
 *            - memberId
 *            example:
 *                  {
                        "memberId": "88fda933-0658-49c4-a9c7-4c0021e9a071",
 *                  }
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
