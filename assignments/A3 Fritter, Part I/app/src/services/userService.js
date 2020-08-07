const userModel = require('../models/userModel');

/*
* create a user
*
* @param {string} name - user name; must be unique
* @param {string} password - user password
* @return {string} - new user's id
* @throws {/DuplicateName/} - if user name is duplicate
*/
module.exports.create = function( name, password) {
  return new Promise((resolve,reject)=>{
    try {
      user_id = userModel.insert( name, password );
      return resolve( user_id );
    } catch (ex) {
      return reject( ex );
    }   
  })
}

/*
* Edit a stored user.
*
* @param {user_id, user, password} user - the user object.
* user and password are optional, if missing the old value
* will be preserved.
* @throws {DuplicateName} - there is another user with name
*/
module.exports.edit = function ( user ) {
  throw new Error("unimplemented");
}

/*
* Remove a stored user
* @param {string} user_id - the user identifier
*/
module.exports.remove = function ( user_id ) {
  throw new Error("unimplemented");
}

/*
* authenticate a user
*
* @param {string} name - user name
* @param {string} password - user password
* @return {string} - the user_id
* @throws {/InvalidCredentials/} - the user name or the 
* password is invalid
*/
module.exports.authenticate = function( name, password ) {
  return new Promise((resolve,reject)=>{
    userModel.get( name )
    .then( ( user ) => {
      if ( user.password === password ) {
        return resolve( user.user_id );
      } else {
        return reject( new Error('InvalidCredentials: '
                        + 'password does not match') );
      }
    })
    .catch( (err) => {
        return reject( new Error('InvalidCredentials: ' 
                                  + err) );
    });
  });
}
