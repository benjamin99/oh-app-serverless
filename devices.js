'use strict';

const table = 'devices';
const crud = require('./crudHandlers');
const utils = require('./utils');
const ERROR_CODE = utils.ERROR_CODE;
const render = utils.render;
const handleDynamoError = utils.handleDynamoError;

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
    if (error) {
      return handleDynamoError(context, headers, error);
    }

    render(context, 201, headers, result);
  });
};

module.exports.list = (event, context, callback) => {
  list(event, (error, result) => {
    if (error) {
      return handleDynamoError(context, headers, error);
    }

    render(context, 200, headers, result);
  });
};

module.exports.show = (event, context, callback) => {
  show(event, (error, item) => {
    if (error) {
      return handleDynamoError(context, headers, error);
    }

    const status = item ? 200 : 404;
    const body = item ? item : {
      error: ERROR_CODE.deviceNotFound,
      message: 'device not found'
    };

    render(context, status, headers, body);
  });
};

module.exports.update = (event, context, callback) => {
  update(event, (error, result) => {
    if (error) {
      return handleDynamoError(context, headers, error);
    }

    render(context, 200, headers, result);
  });
};

module.exports.delete = (event, context, callback) => {
  destroy(event, (error, result) => {
    if (error) {
      return handleDynamoError(context, headers, error);
    }

    render(context, 200, headers, result);
  });
};
