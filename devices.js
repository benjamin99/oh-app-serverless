'use strict';

const table = 'devices';
const crud = require('./crudHandlers');

/** member CRUD implementations */

const create = crud.createHandler(table);
const list = crud.listHandler(table);
const show = crud.showHandler(table);
const update = crud.updateHandler(table);
const destroy = crud.destroyHandler(table);

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
};

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
};