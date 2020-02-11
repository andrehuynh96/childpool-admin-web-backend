const Minio = require('minio')
const config = require("app/config");

let client = new Minio.Client({
  endPoint: config.CDN.url,
  accessKey: config.CDN.accessKey,
  secretKey: config.CDN.secretKey,
  useSSL: true,
})

module.exports = client;