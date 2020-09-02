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
* Edit a user
*
* Modifies user with identifier user_id, with the given
* name and password. If the name (or password) are not
* given, then the old name (or password) will be preserved.
*
* @param {Object} -  user object, must have user_id property,
* name and password are optional.
* @throws {DuplicateName} - if the name is changed to an
* already existing name.  
*/
module.exports.edit = function ( user ) {
  const user_copy = Object.assign( {}, user );
  const user_id = user_copy.user_id;
  delete user_copy.user_id;

  const { assignments, values } = objectToUpdateAssignments( user_copy );

  values.push( user_id );

  const query = "UPDATE users SET " + assignments 
                      + " WHERE user_id = $" 
                      +  (values.length);

  console.log('USER EDIT', user, query, values);

  return new Promise((resolve,reject)=>{
    return client.query( query, values )
    .then(()=>{
      resolve()
    })
    .catch(( err )=>{
      reject( handleError(err) );
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

/**
* Transforms an object into a string of assignments for UPDATE
*
* Example:
*
*   {prop1: val1, prop2: val2} 
*
* is transformed into 
*
*   { "prop1=$1, prop2=$2", [val1, val2] }
*
* @param {Object} - and object
* @return {string, Array} the string of assignments and array of values
*/
function objectToUpdateAssignments( obj ) {

  let i           = 1,
      assignments = [],
      values      = []
  ;

  Object.keys( obj )
  .filter(( prop )=>{
    return obj.hasOwnProperty( prop )
  })
  .forEach(( prop )=>{
    assignments.push( prop + "=$" + (i++) );
    values.push( obj[ prop ] );
  })
  ;

  const result = {
            assignments:  assignments.join(", "), 
            values
  }

  console.log('objectToUpdateAssignments', obj, result);

  return result;
}
