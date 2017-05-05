'use strict';

const uuidV1 = require('uuid/v1');

module.exports.designateManager = function(db, userId) {
  const manager = {
    _id: uuidV1(),
    userIds: [userId],
  }

  db.collection('managers').insertOne(manager)
    .then(result => new Promise((resolve, reject) => resolve(result))
    .catch(err => {
      console.log(err);
      return new Promise((resolve, reject) => reject(err));
    });
}

module.exports.addUser = function(db, managerId, userId, cb) {
  const query = {
    _id: managerId
  }

  const update = {
    $addToSet: { user_ids: userId }
  }
  db.collection('managers').findOneAndUpdate(query, update)
    .then(result)
    .catch(err => {
      console.log(err);
    });
}

module.exports.existOrNot = function(db, managerId, userId) {
  db.colleciton('managers').findOne({ _id: managerId, user_ids: userId })
    .then(result)
    .catch(err)
}
