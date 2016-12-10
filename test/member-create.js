'use strict';

const mod = require('../handlers/members.js');
const mochaPlugin = require('serverless-mocha-plugin');

const lambdaWrapper = mochaPlugin.lambdaWrapper;
const expect = mochaPlugin.chai.expect;
const wrapped = lambdaWrapper.wrap(mod, { handler: 'create' });

describe('member-create', () => {
  before((done) => {
//  lambdaWrapper.init(liveFunction); // Run the deployed lambda

    done();
  });

  it('implement tests here', () => {
    return wrapped.run({
      body: "{ \"message\": \"this is the test\" }"
    }).then((response) => {
      expect(response).to.not.be.empty;
    });
  });
});
