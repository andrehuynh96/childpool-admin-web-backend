const config = require('app/config');
const AWS = require('aws-sdk');

let s3 = new AWS.S3({
  endpoint: config.aws.endpoint,
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey,
  sslEnabled: true
}); 

module.exports = s3;