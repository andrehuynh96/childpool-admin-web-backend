const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const config = require('app/config');

module.exports = function (app, prefix) {
  if (!config.enableDocsLink) {
    return;
  }

  prefix = prefix || '';
  var options = {
    swaggerDefinition: {
      info: {
        title: 'Staking Admin Childpool Backend',
        version: config.app.version,
        buildNumber: config.app.buildNumber,
        description: config.app.description,
      },
      servers: [
        {
          url: 'https://wallet.infinito.io',
        },
      ],
    },
    apis: [path.resolve(__dirname, '../../feature/**/*.js')],
  };

  var swaggerSpec = swaggerJSDoc(options);
  app.get(prefix + '/api-docs.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    (swaggerSpec.securityDefinitions = {
      bearerAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      },
    }),
      (swaggerSpec.security = [
        {
          bearerAuth: [],
        },
      ]);

    res.send(swaggerSpec);
  });

  options = {
    swaggerUrl: prefix + '/api-docs.json',
    showExplorer: true,
  };

  app.use(
    prefix + '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(null, options)
  );
};
