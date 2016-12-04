'use strict';

const AWS = require('aws-sdk');  
const uuid = require('uuid');
const merge = require('lodash').merge;
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.createHandler = function(table) {
  return function(event, callback) {
    const data = JSON.parse(event.body);

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
        callback(error);
      }

      callback(error, params.Item);
    });
  };
};

module.exports.listHandler = function(table) {
  return function(event, callback) {
    const params = { TableName: table };
    return dynamo.scan(params, (error, data) => {
      if (error) {
        callback(error);
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
        callback(error);
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
        callback(error);
      }

      callback(error, params.Item);
    });
  }
};

module.exports.destroyHandler = function(table) {
  return function(event, callback) {
    const params = {
      TableName: table,
      Key: { id: event.pathParameters.id }
    };

    return dynamo.delete(params, (error, data) => {
      if (error) {
        callback(error);
      }

      callback(error, params.Key);
    });
  }
}