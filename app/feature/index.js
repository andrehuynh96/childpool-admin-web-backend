const express = require("express");
const router = express.Router();

router.use(require('./forgot-password/forgot-password.route'));
router.use(require('./set-new-password/set-new-password.route'));
router.use(require('./login/login.route'));
router.use(require('./user/user.route'));
router.use(require('./confirm-ip/confirm-ip.route'));
router.use(require('./confirm-2fa/confirm-2fa.route'));
router.use(require('./account/account.route'));
router.use(require('./grandchild/grandchild.route'));
router.use(require('./partner-api-key/partner-api-key.route'));
router.use(require('./api-key/api-key.route'));
router.use(require('./logout/logout.route'));
router.use(require('./role/role.route'));
router.use(require('./permission/permission.route'));
router.use(require('./partner-commission/partner-commission.route'));
router.use(require('./change-reward-address/change-reward-address.route'));
router.use(require('./partner-tx-memo/partner-tx-memo.route'));
router.use(require('./check-token/check-token.route'));
router.use(require('./email-template/email-template.route'));
router.use(require('./static/static.route'));
router.use('/membership', require('./membership'));
router.use(require('./platform/platform.route'));
router.use('/affiliate', require('./affiliate'));
router.use(require('./currency/currency.route'));
router.use(require('./term/term.route'));
router.use(require('./ada-pool-notify/ada-pool-notify.route'));
router.use(require('./member-asset/member-asset.route'));
router.use(require('./exchange-currency/exchange-currency.route'));
router.use(require('./exchange-transaction/exchange-transaction.route'));
router.use(require('./email-tracking/email-tracking.route'));
router.use(require('./notification/notification.route'));
router.use(require('./remove-2fa/remove-2fa.route'));
router.use(require('./ms-point/ms-point.route'));
router.use(require('./logging/logging.route'));
router.use(require('./questionnaire/questionnaire.route'));

module.exports = router;

/** ********************************************************************/
/**
 * @swagger
 * definition:
 *   error:
 *     properties:
 *       message:
 *         type: string
 *       error:
 *         type: string
 *       code:
 *         type: string
 *       fields:
 *         type: object
 */

/**
 * @swagger
 * definition:
 *   200:
 *     properties:
 *       data:
 *         type: object
 *     example:
 *       data: true
 *
 */

/**
 * @swagger
 * definition:
 *   400:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Missing parameters
 *           error: error
 *           code: USER_NOT_FOUND
 *           fields: ['email']
 */

/**
 * @swagger
 * definition:
 *   401:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Unauthorized
 *           error: error
 *           code: USER_NOT_FOUND
 */

/**
 * @swagger
 * definition:
 *   403:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Forbidden
 *           error: error
 *           code: USER_NOT_FOUND
 */

/**
 * @swagger
 * definition:
 *   404:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Not Found
 *           error: error
 *           code: USER_NOT_FOUND
 */

/**
 * @swagger
 * definition:
 *   500:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Server Internal Error
 *           error: error
 *           code: USER_NOT_FOUND
 */
