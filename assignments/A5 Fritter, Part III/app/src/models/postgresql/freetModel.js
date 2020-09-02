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
      console.log('FREET CREATE', freet_id);
      resolve( freet_id )
    })
    .catch((err)=>{
      reject( handleError(err) )
    })
  })
}


/**
* Search tweets that have properties with certain values.
*
* @param {object} query - properties with their values
* @return {Array} - a Promise that resolves a freet array
*/
module.exports.search = function ( query={} ) {
  return new Promise((resolve,reject)=>{
    console.log('QUERY', query);

    let filter = '';
    let values = [];
    for ( prop in query ) {
      if (query.hasOwnProperty( prop )) {
        filter += " AND " + (prop === 'author' ? 'name' : prop) + " = $1";
        values.push( query[ prop ] )
      }
    }

    client.query("SELECT freet_id, user_id AS author_id, name AS author,"
                  + " message, votes "
                  + " FROM users, freets"
                  + " WHERE users.user_id = freets.author_id"
                  + filter,
                  values)
    .then(( res )=>{
      // console.log('RES', res);
      resolve( res.rows )
    })
    .catch(( err )=>{
      reject( handleError( err ) )
    })
  })
}


/**
* Delete a freet.
*
* @param {string} freet_id - the freet identifier
* @throws FreetNotFound - if there is no freet with given identifier
*/
module.exports.delete = function( freet_id ) {
  return new Promise((resolve,reject)=>{
    client.query("DELETE FROM freets WHERE freet_id = $1", [ freet_id ])
    .then(( res )=>{
      console.log('FREET DELETE', freet_id, res.rowCount);
      if (res.rowCount === 0) {
        reject( new Error("FreetNotFound: " + freet_id) )
      } else {
        resolve();
      }
    })
  })
}


/**
* Get a freet.
*
* @param {string} freet_id - the freet identifier
* @return {Object} - the freet object,
* @throws FreetNotFound - if there is no freet with given identifier
*/
module.exports.get = function( freet_id ) {
  return new Promise((resolve,reject)=>{
    client.query("SELECT * FROM freets WHERE freet_id = $1", [ freet_id ])
    .then(( res )=>{
      console.log('FREET GET', freet_id, res.rowCount);
      if (res.rowCount === 0) {
        reject( new Error('FreetNotFound') );
      } else {
        resolve( res.rows[0] );
      }
    })
  })
}



//------------------------------------------------------------- 
//                     START PRIVATE FUNCTIONS
//------------------------------------------------------------- 

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

