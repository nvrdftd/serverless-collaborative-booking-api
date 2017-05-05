'use strict';

module.exports.generatePolicy = function(principalId, effect, resource) {
  let authResponse = {
    principalId: principalId
  };

  if (effect && resource) {
    let policyDocument = {};
    let statementOne = {};

    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}
