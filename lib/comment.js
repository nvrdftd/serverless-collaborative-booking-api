'use strict';

module.exports.saveComments = function(db, managerId, listOfComments, cb) {
  db.collection('comments')
    .insertOne(listOfComments)
    .then(result => cb(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully updated comments'
      })
    }))
    .catch(err => {
        console.log(err);
        cb(null, {
          statusCode: 500,
          body: JSON.stringify({
            message: 'Failed to update comments'
          }}))
    });
}

module.exports.showComment = function() {

}
