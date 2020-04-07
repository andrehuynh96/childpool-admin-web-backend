const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./api-key.controller');

const router = express.Router();

router.delete(
  '/partners/:id/keys/:key',
  authenticate,
  controller.revokeAPIKey
);

module.exports = router;

/*********************************************************************/


/**
 * @swagger
 * /web/partners/{id}/keys/{key}:
 *   delete:
 *     summary: revoke API key
 *     tags:
 *       - API Key
 *     description: revoke API key
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *       - name: key
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
 *                 "data":true
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
