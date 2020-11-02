const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const authority = require('app/middleware/authority.middleware');
const controller = require('./fiat-transaction.controller');
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./fiat-transaction.request-schema');
const router = express.Router();

router.get('/fiat-transactions',
  authenticate,
  authority(PermissionKey.VIEW_LIST_FIAT_TRANSACTION),
  validator(requestSchema,'query'),
  controller.search
);

router.get('/fiat-transactions/statuses',
  authenticate,
  controller.getStatuses
);

router.get('/fiat-transactions/payment-methods',
  authenticate,
  controller.getPaymentMethods
);

router.get('/fiat-transactions/download-csv',
  authenticate,
  authority(PermissionKey.EXPORT_FIAT_TRANSACTION_CSV),
  validator(requestSchema,'query'),
  controller.downloadCSV
);

router.get('/fiat-transactions/:id/details',
  authenticate,
  controller.getDetails
);

module.exports = router;
