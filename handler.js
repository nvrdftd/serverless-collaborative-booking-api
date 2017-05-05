'use strict';

const MongoClient = require('mongodb').MongoClient;
const config = require('./config');
const comment = require('./lib/comment');
const manager = require('./lib/manager');
const user = require('./lib/user');
const tokenValidation = require('./lib/tokenValidation');
const .generatePolicy = require('./lib/generatePolicy').generatePolicy;

MongoClient.connect(config.dbUrl).then(db => {
  module.exports.designateManager = (event. context, cb) => {
    if (!event.userId) {
      cb(new Error('Missing user identification'));
    }
    manager.designateManager(db, event.userId)
      .then(result => cb(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Designated new manager'
          })
      }))
      .catch(err => {
        console.log(err);
        cb(null, {
          statusCode: 500,
          body: JSON.stringify({
            message: 'Internal server error'
          })
      });
}).catch(err => console.log(err));

// custom authorizer before invoking APIs
module.exports.auth = (event, context, cb) => {
  const validationRegex = /^Bearer /;

  if (!event.authorizationToken) {
    return cb(new Error('Missing token'));
  }

  if (!validationRegex.test(event.authorizationToken)) {
    return cb(new Error('Invalid token'))
  }
  const token = event.authorizationToken.toString().split(' ')[1];

  tokenValidation.verify(token, (err, decoded) => {
    if (err) {
      cb(err);
    }
    cb(null, generatePolicy('User', 'Allow', event.methodArn));
  });
}
