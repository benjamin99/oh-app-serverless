'use strict';

const AWS = require('aws-sdk');
const DYNAMO_DB_ERROR = require('./utils').DYNAMO_DB_ERROR;
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.createHandler = function(table) {
  return function(data, callback) {
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

module.exports.queryHandler = function(table) {
  return function(params, callback) {
    params.TableName = table;
    return dynamo.query(params, (error, data) => {
      if (error) {
        error.name = DYNAMO_DB_ERROR;
        return callback(error);
      }

      callback(error, data);
    })
  }
}

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