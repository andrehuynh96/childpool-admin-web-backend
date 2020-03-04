const express = require("express");
const controller = require("./grandchild.controller");
const { create } = require("./validator");
const validator = require("app/middleware/validator.middleware");
const authenticate = require('app/middleware/authenticate.middleware');
const route = express.Router();

route.post("/grandchild",
  validator(create),
  authenticate,
  controller.create
);

route.get("/grandchild",
  authenticate,
  controller.getAll
);

module.exports = route;

/*********************************************************************/