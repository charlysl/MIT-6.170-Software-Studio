const { Client } = require('pg');

const client = new Client({
  user:        'postgres',
  host:       'localhost',
  // database:   'postgres',
  database:   'fritter_test',
  password:   'password',
  port:       5432
});

client.connect();


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

