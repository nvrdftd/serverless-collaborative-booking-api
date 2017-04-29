'use strict';

const MongoClient = require('mongodb').MongoClient;
const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const config = require('./config');
const comments = require('./models/comments');

function requestException(err) {
  this.name = err.name;
  this.message = err.message;
}

// create a helper function to verify access tokens
function verify(token, cb) {

  const client = jwksClient({
    cache: true,
    jwksUri: 'https://nvrdftd.auth0.com/.well-known/jwks.json'
  });

  client.getSigningKeys((err, signingKeys) => {
    if (err) {
      return cb(new requestException(err));
    }

    const options = {
      audience: 'https://vrcim6kmtg.execute-api.us-east-1.amazonaws.com/dev/',
      issuer: 'https://nvrdftd.auth0.com/',
      algorithms: ['RS256']
    }


    jwt.verify(token, signingKeys[0].publicKey, options, (err, decoded) => {
      if (err) {
        return cb(err);
      }
      cb(null, decoded);
    });
  });
}


// create a helper function to establish policies
function generatePolicy(principalId, effect, resource) {
  let authResponse = {
    principalId: principalId
  };
  if (effect && resource) {
    let policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    let statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}

MongoClient.connect(config.dbUrl).then(db => {
  module.exports.saveComment = (event. context, cb) => {
    comments(db, event, cb);
  }
}).catch(err => console.log('db connection failed'));

// custom authorizer before invoking APIs
module.exports.auth = (event, context, cb) => {
  if (!event.authorizationToken) {
    return cb('Token Not Provided');
  }
  const token = event.authorizationToken.split(' ')[1];
  verify(token, (err, decoded) => {
    if (err) {
      cb('Invalid Token');
    }
    cb(null, generatePolicy('User', 'Allow', event.methodArn));
  });
}

module.exports.hello = (event, context, cb) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
    })
  };
  cb(null, response);
};
