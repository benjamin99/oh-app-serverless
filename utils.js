'use strict';

const DYNAMO_DB_ERROR = module.exports.DYNAMO_DB_ERROR = 'dynamo-db-error';

const ERROR_CODE = module.exports.ERROR_CODE = {
  // 10xx: common error
  unknown: 1000,
  notFound: 1001,
  forbidden: 1002,
  serviceUnavailable: 1003,

  // 11xx: validation error
  validationError: 1100,

  // 12xx: resource error
  memberNotFound: 1200,
  deviceNotFound: 1201,
  eventNotFound: 1202

  // 13xx: data error

  // 14xx: auth error
};

function render(context, statusCode, headers, body) {
  context.succeed({
    statusCode,
    headers,
    body: JSON.stringify(body)
  });
}

module.exports.render = render;

function handlerError(context, headers, error) {
  if (error.name === DYNAMO_DB_ERROR) {
    return handleDynamoError(context, headers, error);
  } else if (error.isJoi) {
    return handleJoiError(context, headers, error);
  }

  console.log(`unexpected error: ${error}`);

  render(context, 500, headers, {
    error: ERROR_CODE.unknown,
    message: 'unknown error'
  });
}

function handleDynamoError(context, headers, error) {
  console.log(error);
  render(context, 500, headers, {
    error: ERROR_CODE.serviceUnavailable,
    message: 'infrastructure error'
  });
}

function handleJoiError(context, headers, error) {
  console.log(error);
  render(context, 400, headers, {
    error: ERROR_CODE.validationError,
    field: error.details[0].path,
    message: error.details[0].message
  });
}

module.exports.handleError = handlerError;