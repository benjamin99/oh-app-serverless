'use strict';

const Promise = require('bluebird');
const Joi = Promise.promisifyAll(require('joi'));
const geohash = require('ngeohash');
const crud = require('./crudHandlers');
const utils = require('./utils');
const ERROR_CODE = utils.ERROR_CODE;
const render = utils.render;
const handleError = utils.handleError;

const table = 'events';

/** member CRUD implementations */

function eventCreatePreprocess(data) {
  data.geohash = geohash.encode(data.latitude, data.longitude, 10);
  return data;
}

const create = Promise.promisify(crud.createHandler(table, eventCreatePreprocess));
const list = Promise.promisify(crud.listHandler(table));
const show = Promise.promisify(crud.showHandler(table));
const update = Promise.promisify(crud.updateHandler(table));
const destroy = Promise.promisify(crud.destroyHandler(table));

/** Joi schemas */

const createSchema = Joi.object().keys({
  title: Joi.string(),
  content: Joi.string(),
  imageUrl: Joi.string(),
  channelId: Joi.string(),
  latitude: Joi.number(),
  longitude: Joi.number()
}).requiredKeys('title', 'content', 'latitude', 'longitude');

/** lambda function implementations */

const headers = { 'Access-Control-Allow-Origin': '*' };

module.exports.create = (event, context, callback) => {
  Joi.validateAsync(event.body, createSchema)
    .then(form => { return create(event); })
    .then(result => render(context, 201, headers, result))
    .catch(error => handleError(context, headers, error));
};

module.exports.list = (event, context, callback) => {
  list(event)
    .then(result => render(context, 200, headers, result))
    .catch(error => handleError(context, headers, error));
};

module.exports.show = (event, context, callback) => {
  show(event).then(item => {
    const status = item ? 200 : 404
    const body = item ? item : {
      error: ERROR_CODE.eventNotFound,
      message: 'event not found'
    };

    render(context, status, headers, body);
  }).catch(error => handleError(context, headers, error));
};

module.exports.update = (event, context, callback) => {
  update(event)
    .then(result => render(context, 200, headers, result))
    .catch(error => handleError(context, headers, error));
};

module.exports.destroy = (event, context, callback) => {
  destroy(event).then(result => {
    if (!result.Attributes) {
      return render(context, 404, headers, {
        error: ERROR_CODE.eventNotFound,
        message: 'event not found'
      });
    }

    render(context, 200, headers, { id: result.Attributes.id });

  }).catch(error => handleError(context, headers, error));
};
