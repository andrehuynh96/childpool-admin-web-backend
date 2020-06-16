const express = require("express");
const controller = require("./platform.controller");
const authenticate = require('app/middleware/authenticate.middleware');
const route = express.Router();

route.get("/platforms",
  authenticate,
  controller.get
);

module.exports = route;


/**
* @swagger
* /web/platforms:
*   get:
*     summary: get platforms
*     tags:
*       - Platform
*     description: get platforms
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
                      "symbol" : "ONG",
                      "name" : "Ontology Gas"
                    },
                    {
                      "symbol" : "ETH",
                      "name" : "Ethereum"
                    },
                    {
                      "symbol" : "ATOM",
                      "name" : "Cosmos"
                    },
                    {
                      "symbol" : "IRIS",
                      "name" : "Iris"
                    },
                    {
                      "symbol" : "ONT",
                      "name" : "Ontology"
                    },
                    {
                      "symbol" : "ADA",
                      "name" : "Cardano"
                    },
                    {
                      "symbol" : "BTC",
                      "name" : "Bitcoin"
                    },
                    {
                      "symbol" : "USDT",
                      "name" : "Tether USD"
                    },
                    {
                      "symbol" : "BTCSW",
                      "name" : "Bitcoin"
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