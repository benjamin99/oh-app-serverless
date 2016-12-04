'use strict';

const AWS = require('aws-sdk');  
const uuid = require('uuid');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TableName = 'members';

/** member CRUD implementations */

function create(event, callback) {
  const data = JSON.parse(event.body);

  data.id = uuid.v1();
  const datetime = new Date().getTime();
  data.createdAt = datetime;
  data.updatedAt = datetime;

  const params = {
    TableName,
    Item: data
  };

  return dynamo.put(params, (error, data) => {
    if (error) {
      callback(error);
    }

    callback(error, params.Item);
  });
}

function list(event, callback) {
  const params = { TableName };
  return dynamo.scan(params, (error, data) => {
    if (error) {
      callback(error);
    }

    callback(error, data.Items);
  });
}

function show(event, callback) {
  const params = {
    TableName,
    Key: { id: event.pathParameters.id }
  };

  return dynamo.get(params, (error, data) => {
    if (error) {
      callback(error);
    }

    callback(error, data.Item);
  });
}

function update(event, callback) {
  const data = JSON.parse(event.body);

  data.id = event.pathParameters.id;
  data.updatedAt = new Date().getTime();

  const params = {
    TableName,
    Item: data
  };

  return dynamo.put(params, (error, data) => {
    if (error) {
      callback(error);
    }

    callback(error, params.Item);
  });
}

function destroy(event, callback) {
  const params = {
    TableName,
    Key: { id: event.pathParameters.id }
  };

  return dynamo.delete(params, (error, data) => {
    if (error) {
      callback(error);
    }

    callback(error, params.Key);
  })
}

/** lambda function implementations */

const headers = { 'Access-Control-Allow-Origin': '*' };

module.exports.create = (event, context, callback) => {
  create(event, (error, result) => {

    // TODO: should handle the error message ...

    const response = {
      statusCode: 201,
      headers,
      body: JSON.stringify(result)
    };

    context.succeed(response);
  });
}

module.exports.list = (event, context, callback) => {
  list(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

    context.succeed(response);
  });
};

module.exports.show = (event, context, callback) => {
  show(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    }

    context.succeed(response);
  });
};

module.exports.update = (event, context, callback) => {
  update(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    }

    context.succeed(response);
  });
};

module.exports.delete = (event, context, callback) => {
  destroy(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

    context.succeed(response);
  });
}