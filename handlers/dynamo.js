'use strict';

const AWS = require('aws-sdk');
const env = process.env.NODE_ENV || 'development';

const dynamo = (env === 'test') ? 
  new AWS.DynamoDB({
    region: 'localhost',
    endpoint: 'http://localhost:9000'
  }) : new AWS.DynamoDB.DocumentClient();

module.exports = dynamo;
