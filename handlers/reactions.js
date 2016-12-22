'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const uuid = require('uuid');
const Joi = Promise.promisifyAll(require('joi'));
const crud = require('./crudHandlers');
const utils = require('./utils');
const ERROR_CODE = utils.ERROR_CODE;
const render = utils.render;
const handleError = utils.handleError;

const table = 'reactions';

/** member CRUD implementations */

const create = Promise.promisify(crud.createHandler(table));
const query = Promise.promisify(crud.queryHandler(table));
const destroy = Promise.promisify(crud.deleteHandler(table));

/** utilities */

function getTargetId(event) {
  const targetId = event.pathParameters.id;
  if (!targetId) {
    throw Error('should contain the target id in the path parameters');
  }
  return targetId;
}

function getReactionId(event) {
  const reactionId = event.pathParameters.reactionId;
  if (!reactionId) {
    throw Error('should contain the reaction id in the path parameters');
  }
  return reactionId;
}

function createReactionData(targetId, form) {
  const datetime = new Date().getTime();
  const data = _.assign({}, form, {
    id: uuid.v4(),
    targetId,
    createdAt: datetime
  });

  return data;
}

function listQueryPromise(targetId) {
  const params = {
    KeyConditionExpression: 'targetId = :targetId',
    ExpressionAttributeValues: { ':targetId': targetId }
  };

  return query(params);
}

function showQueryPromise(targetId, reactionId) {
  const params = {
    KeyConditionExpression: 'targetId = :targetId AND id = :reactionId',
    ExpressionAttributeValues: { 
      ':targetId': targetId,
      ':reactionId': reactionId 
    }
  }

  return query(params);
}

/** Joi schemas */

const REACTION_TYPES = [0];

const createSchema = Joi.object().keys({
  type: Joi.any().allow(REACTION_TYPES)
});

/** lambda function implementations */

const headers = { 'Access-Control-Allow-Origin': '*' };

module.exports.create = (event, context, callback) => {
  const targetId = getTargetId(event);
  Joi.validateAsync(event.body, createSchema)
    .then(form => {
      const data = createReactionData(targetId, form);
      return create(data);
    })
    .then(result => render(context, 201, headers, result))
    .catch(error => handleError(context, headers, error));
};

module.exports.list = (event, context, callback) => {
  const targetId = getTargetId(event);
  return listQueryPromise(targetId)
    .then(result => render(context, 200, headers, result.Items))
    .catch(error => handleError(context, headers, error));
};

module.exports.show = (event, context, callback) => {
  const targetId = getTargetId(event);
  const reactionId = getReactionId(event);
  return showQueryPromise(targetId, reactionId)
    .then(result => {
      const item = result.Items[0];
      const status = item ? 200 : 404
      const body = item ? item : {
        error: ERROR_CODE.reactionNotFound,
        message: 'reaction not found'
      };

      render(context, status, headers, body);
    })
    .catch(error => handleError(context, headers, error));
};

module.exports.destroy = (event, context, callback) => {
  const targetId = getTargetId(event);
  const reactionId = getReactionId(event);
  const params = {
    Key: { targetId, id: reactionId }
  };

  return destroy(params).then(result => {
    if (!result.Attributes) {
      return render(context, 404, headers, {
        error: ERROR_CODE.eventNotFound,
        message: 'event not found'
      });
    }

    render(context, 200, headers, { id: result.Attributes.id });
  }).catch(error => handleError(context, headers, error));
};