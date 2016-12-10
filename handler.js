'use strict';

module.exports.index = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: 'OK'
  };

  callback(null, response);
};
