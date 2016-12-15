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

const table = 'events';

/** member CRUD implementations */

const create = Promise.promisify(crud.createHandler(table));
const list = Promise.promisify(crud.listHandler(table));
const query = Promise.promisify(crud.queryHandler(table));
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

const listSchema = Joi.object().keys({
  latitude: Joi.number(),
  longitude: Joi.number(),
  limit: Joi.number().integer().default(30)
}).with('latitude', 'longitude');

/* utilities */

function createEventData(form, memberId) {
  const datetime = new Date().getTime();
  const geohash = ngeohash.encode(form.latitude, form.longitude, 10);
  const rangeKeyValue = `${datetime}:${memberId}`;

  return merge(form, {
    id: uuid.v4(),
    geohash,
    rangeKeyValue
  });
}

function queryPromiseWithHash(hash) {
  const params = {
    KeyConditionExpression: 'geohash = :hashValue',
    ExpressionAttributeValues: { ':hashValue': hash }
  };

  return query(params);
}

/** lambda function implementations */

const headers = { 'Access-Control-Allow-Origin': '*' };

module.exports.create = (event, context, callback) => {
  Joi.validateAsync(event.body, createSchema)
    .then(form => {
      const data = createEventData(form, '12'); // TODO: get the memberId
      return create(data); 
    })
    .then(result => render(context, 201, headers, result))
    .catch(error => handleError(context, headers, error));
};

module.exports.list = (event, context, callback) => {
  const queryParams = event.queryStringParameters || {};
  Joi.validateAsync(queryParams, listSchema)
    .then(form => {
      if (form.latitude) {
        const origin = ngeohash.encode(form.latitude, form.longitude, 10);
        console.log('origin: ' + origin);
        const searchResions = ngeohash.neighbors(origin);
        searchResions.push(origin);
        console.log(searchResions);

        return Promise.all(_.map(searchResions, hash => queryPromiseWithHash(hash)));
      }
      
      return list({});
    })
    .then(result => {
      if (Array.isArray(result)) {
        const collection = [];
        for (const r of result) {
          for (const item of r.Items) {
            collection.push(item);
          }
        }
        
        return render(context, 200, headers, collection);
      }
      render(context, 200, headers, result)
    })
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
