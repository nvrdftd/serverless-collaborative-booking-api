'use strict';

const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const config = require('../config');

function requestException(err) {
  this.name = err.name;
  this.message = err.message;
}

module.exports.verify = function(token, cb) {
  const client = jwksClient({
    cache: true,
    jwksUri: config.jwksUri
  });

  client.getSigningKeys((err, signingKeys) => {
    if (err) {
      return cb(new requestException(err));
    }

    const options = {
      audience: config.audience,
      issuer: config.issuer,
      algorithms: config.algorithms
    }

    jwt.verify(token, signingKeys[0].publicKey, options, (err, decoded) => {
      if (err) {
        return cb(err);
      }
      cb(null, decoded);
    });
  });
}
