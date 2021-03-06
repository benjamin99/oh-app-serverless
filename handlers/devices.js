'use strict';

const Promise = require('bluebird');
const uuid = require('uuid');
// const Joi = Promise.promisifyAll(require('joi'));
const table = 'devices';
const crud = require('./crudHandlers');
const utils = require('./utils');
const ERROR_CODE = utils.ERROR_CODE;
const render = utils.render;
const handleError = utils.handleError;

/** member CRUD implementations */

const create = Promise.promisify(crud.createHandler(table));
const list = Promise.promisify(crud.listHandler(table));
const show = Promise.promisify(crud.showHandler(table));
const update = Promise.promisify(crud.updateHandler(table));
const destroy = Promise.promisify(crud.destroyHandler(table));

/** lambda function implementations */

const headers = { 'Access-Control-Allow-Origin': '*' };

module.exports.create = (event, context, callback) => {
  const data = JSON.parse(event.body);
  data.id = uuid.v4();

  create(data)
    .then(result => render(context, 201, headers, result))
    .catch(error => handleError(context, headers, error));
};

module.exports.list = (event, context, callback) => {
  const params = {};
  list(params)
    .then(result => render(context, 200, headers, result))
    .catch(error => handleError(context, headers, error));
};

module.exports.show = (event, context, callback) => {
  show(event).then(item => {
    const status = item ? 200: 404;
    const body = item ? item : {
      error: ERROR_CODE.deviceNotFound,
      message: 'device not found'
    };

    render(context, status, headers, body);

  }).catch(error => handleError(context, headers, error));
};

module.exports.update = (event, context, callback) => {
  update(event)
    .then(result => render(context, 200, headers, result))
    .catch(error => handleError(context, headers, error));
};

module.exports.delete = (event, context, callback) => {
  destroy(event)
    .then(result => render(context, 200, headers, result))
    .catch(error => handleError(context, headers, error));
};
