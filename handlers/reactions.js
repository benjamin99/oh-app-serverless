'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const uuid = require('uuid');
const merge = require('lodash').merge;
const Joi = Promise.promisifyAll(require('joi'));
const ngeohash = require('ngeohash');
const crud = require('./crudHandlers');
const utils = require('./utils');
const ERROR_CODE = utils.ERROR_CODE;
const render = utils.render;
const handleError = utils.handleError;

const table = 'reactions';

/** member CRUD implementations */

const create = Promise.promisify(crud.createHandler(table));
const list = Promise.promisify(crud.listHandler(table));
const query = Promise.promisify(crud.queryHandler(table));
const show = Promise.promisify(crud.showHandler(table));
const update = Promise.promisify(crud.updateHandler(table));
const destroy = Promise.promisify(crud.destroyHandler(table));

/** Joi schemas */

const createSchema = Joi.object().keys({
  targetId: Joi.string(),
  type: Joi.number().integer()
}).requiredKeys('targetId', 'type');

/** lambda function implementations */

const headers = { 'Access-Control-Allow-Origin': '*' };

module.exports.create = (event, context, callback) => {
  // TODO ...
};

module.exports.list = (event, context, callback) => {
  // TODO ...
};

module.exports.show = (event, context, callback) => {
  // TODO ...
};

module.exports.update = (event, context, callback) => {
  // TODO ...
};

module.exports.destroy = (event, context, callback) => {
  // TODO ...
};