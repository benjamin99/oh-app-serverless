'use strict';

const ERROR_CODE = module.exports.ERROR_CODE = {
  // 10xx: common error
  unknown: 1000,
  notFound: 1001,
  forbidden: 1002,
  serviceUnavailable: 1003,

  // 11xx: validation error
  
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

function handleDynamoError(context, headers, error) {
  console.log(error);
  render(context, 500, headers, {
    error: ERROR_CODE.serviceUnavailable,
    message: 'infrastructure error'
  });
}

module.exports.handleDynamoError = handleDynamoError;