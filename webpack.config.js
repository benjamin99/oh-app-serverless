'use strict';

const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: {
    healthCheck: './handlers/healthCheck.js', 
    devices: './handlers/devices.js', 
    members: './handlers/members.js',
    events: './handlers/events.js',
    reactions: './handlers/reactions'
  },
  output: {
    libraryTarget: 'commonjs',
    path: '.webpack',
    filename: 'handlers/[name].js'
  },
  externals: [
    nodeExternals()
  ],
  target: 'node'
};