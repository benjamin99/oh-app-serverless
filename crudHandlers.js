'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');
const merge = require('lodash').merge;
const DYNAMO_DB_ERROR = require('./utils').DYNAMO_DB_ERROR;
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.createHandler = function(table, preprocess) {
  return function(event, callback) {
    const data = (typeof preprocess === 'function') ? preprocess(JSON.parse(event.body)) : JSON.parse(event.body);
    const datetime = new Date().getTime();
    
    merge(data, {
      id: uuid.v1(),
      createdAt: datetime,
      updatedAt: datetime
    });

    const params = {
      TableName: table,
      Item: data
    };

    return dynamo.put(params, (error, data) => {
      if (error) {
        error.name = DYNAMO_DB_ERROR;
        return callback(error);
      }

      callback(error, params.Item);
    });
  };
};

module.exports.listHandler = function(table) {
  return function(params, callback) {
    params.TableName = table;
    return dynamo.scan(params, (error, data) => {
      if (error) {
        error.name = DYNAMO_DB_ERROR;
        return callback(error);
      }

      callback(error, data.Items);
    });
  };
};

module.exports.showHandler = function(table) {
  return function(event, callback) {
    const params = {
      TableName: table,
      Key: { id: event.pathParameters.id }
    };

    return dynamo.get(params, (error, data) => {
      if (error) {
        error.name = DYNAMO_DB_ERROR;
        return callback(error);
      }

      callback(error, data.Item);
    });
  }
};

module.exports.updateHandler = function(table) {
  return function(event, callback) {
    const data = JSON.parse(event.body);

    data.id = event.pathParameters.id;
    data.updatedAt = new Date().getTime();

    const params = {
      TableName: table,
      Item: data
    };

    return dynamo.put(params, (error, data) => {
      if (error) {
        error.name = DYNAMO_DB_ERROR;
        return callback(error);
      }

      callback(error, params.Item);
    });
  }
};

module.exports.destroyHandler = function(table) {
  return function(event, callback) {
    const params = {
      TableName: table,
      Key: { id: event.pathParameters.id },
      ReturnValues: 'ALL_OLD'
    };

    return dynamo.delete(params, (error, data) => {
      if (error) {
        error.name = DYNAMO_DB_ERROR;
        return callback(error);
      }

      callback(error, data);
    });
  }
}