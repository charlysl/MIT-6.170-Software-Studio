const uuid = require('uuid');

const client = require('./postgresClient');

/**
* Insert a freet into the storage.
*
* @param {Object} - an object with an author_id, a message and votes.
* @return {Promise} - resolves to a unique freet identifier
* @throws {MessageTooLong} - if the message is more than 140 characters long
*/
module.exports.insert = function ( freet ) {
  return new Promise((resolve,reject)=>{

    const freet_id = uuid.v4();

    const values = [  freet_id, 
                      freet.author_id, 
                      freet.message, 
                      freet.votes 
          ];

    client.query( "INSERT INTO freets (freet_id, author_id, message, votes) VALUES ($1,$2,$3,$4)", 
                  values)
    .then(()=>{
      resolve( freet_id )
    })
    .catch((err)=>{
      reject( handleError(err) )
    })
  })
}


function handleError( err ) {
  if (err.code) {
    switch (err.code) {
      case '23514':
        //new row for relation "freets" violates check 
        //constraint "freets_message_check"
        return new Error('/MessageTooLong');
    }
  }

  // default is unexpected error
  return new Error('Caught unexpected error: ' + err)
}

