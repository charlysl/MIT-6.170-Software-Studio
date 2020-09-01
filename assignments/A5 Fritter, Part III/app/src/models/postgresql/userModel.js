const client = require('./postgresClient');

/**
* Insert a user in storage.
*
* Assigns a unique identifier string to the user. 
*
* @param {String} name - user name; must be unique
* @param {String} password - user password
* @return {Promise} - the user's unique identifier
* @throws {/DuplicateName/} - if name is duplicate
*/
module.exports.insert = function( name, password ) {
  return new Promise((resolve,reject)=>{
    client.query("INSERT INTO users (name, password) VALUES ($1, $2)",
                [ name, password ])
    .then(()=>{
      return client.query("SELECT user_id FROM users WHERE name = $1", [ name ])
    })
    .then(( res )=>{
      const user_id = res.rows[0].user_id;
      resolve( user_id );
    })
    .catch((err)=>{
      reject( handleError( err ) );
    });
  });
}


/**
* Get a user by name from storage
*
* @param {String} name - user name
* @return {User} - a promise that resolves to the 
* user object, with id, name and password
* @throws {NameNotFound} - if there is no user with given name
*/
module.exports.get = function( name ) {
  return new Promise((resolve,reject)=>{
    client.query("SELECT * FROM users WHERE name = $1", [ name ])
    .then(( res )=>{
      if ( res.rows.length === 0 ) {
        reject( new Error('NameNotFound: ' + name) );
      } else {
        resolve( res.rows[0] );
      }
    })
    .catch((err)=>{
      reject( handleError(err) );
    })
  });
}


/**
* Remove a user
*
* TODO should also remove its freets
*
* @return {Promise} - a promise that doesn't resolve 
* to any value.
*/
module.exports.remove = function( user_id ) {
  return new Promise((resolve,reject)=>{
    client.query("DELETE FROM freets WHERE author_id = $1", 
            [ user_id ])
    .then(()=>{
      return  client.query("DELETE FROM users WHERE user_id = $1", 
              [ user_id ])
    })
    .then(()=>{
      resolve()
    })
    .catch((err)=>{
      reject( handleError(err) )
    })
  })
}




/**
* Centralizes error handling.
*/
function handleError( err ) {
  if ( err.code ) {
    switch (err.code) {
      case '23505':
        return new Error('DuplicateName');
      case '23502':
        //catches missing user name or password in insert
        //null value in column "name" violates not-null constraint
        return new Error('MissingParameter');

    }
  }

  //default
  console.error( err );
  return new Error('Caught unexpected error: ' + err.message);
}

