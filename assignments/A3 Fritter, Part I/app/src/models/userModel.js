const uuid = require('uuid');

/**
* models/userModel.js
*
* This module presents an interface for storing,
* modifying and retrieving users.
*
* It is also responsible for generating unique
* user identifiers, and for guaranteing that user
* names are unique.
*/

// the user store is represented as a dictionary
const userMap = {};

// Abstraction function:
//  Each ownProperty in userMap represents a user.
//  The key is the user id, and the value contains user
//  data, such as name and password.
//
// Rep Invariant:
//  - Keys must be strings
//  - Values must be objects with a name and a password 
//    property
//  - Names and passwords must be strings.
//  - User names must be unique
//
// Safety from rep exposure:
//  - all values are strings, which are immutable, and hence
//    safe from aliasing
//  - the value object is frozen; if it needs to be modified,
//    it is a copy that is modified

const checkRep = function() {

  const nameSet = new Set();

  for ( const key in userMap ) {
    if ( ( typeof(key) !== 'string' ) ) {
      throw new Error( 'key is not string: ' + key);
    }
    const user = userMap[ key ];
    if ( ( typeof( user ) !== 'object' ) ) {
      throw new Error( 'user is not an object: ' + user);
    }
    if ( ! ( user.hasOwnProperty( 'name' ) ) ) {
      throw new Error( 'user has no name: ' + user );
    }
    if ( ! ( user.hasOwnProperty( 'password' ) ) ) {
      throw new Error( 'user has no password: ' + user );
    }
    if ( ( typeof(user.name) !== 'string' )) {
      throw new Error( 'user name is not a string: ' 
                        + user.name );
    }
    if ( ( typeof(user.password) !== 'string' )) {
      throw new Error( 'user password is not a string: ' 
                        + user.password );
    }
    if ( nameSet.has( user.name ) ) {
      throw new Error( 'user name is duplicate: ' 
                        + user.name);
    }

    nameSet.add( user.name ); }

}

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
  return new Promise((resolve, reject) => {
    try {
      getUserByName( name );
      reject( new Error('DuplicateName: ' + name) );
      return;
    } catch (ex) {
      if ( ! (ex.message.match( /^NameNotFound/ )) ) {
        throw new Error('Caught unexpected exception:' + ex);
      }
    }

    const user_id = uuid.v4();
    let user = {
                user_id, 
                name, 
                password
    };

    Object.freeze(user);

    userMap[user_id] = user;

    checkRep();

    resolve( user_id );
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
  return new Promise(( resolve, reject) => {
    try {
      const user = getUserByName( name );
      return resolve( user );
    } catch ( ex ) {
      return reject( ex );
    }
  });
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
  return new Promise((resolve,reject)=>{
    try {
      const old_user = userMap[ user.user_id ];

      if (isDuplicateName( user )) {
        reject(new Error('DuplicateName: ' + user.name));
        return;
      }

      const new_user = {};
      Object.assign( new_user, old_user );
      Object.assign( new_user, user );
      Object.freeze( new_user );

      userMap[ new_user.user_id ] = new_user;

      checkRep();

      resolve();
    } catch (ex) {
      reject(ex);
    }
  });
}

/**
* Remove a user
* @return {Promise} - a promise that doesn't resolve 
* to any value.
*/
module.exports.remove = function( user_id ) {
  return new Promise((resolve,reject)=>{
    delete userMap[ user_id ];
    resolve();
  });
}

const getUserByName = function( name ) {
  for (const user_id in userMap) {
    const user = userMap[ user_id ];
    if ( user.name === name ) {
      return user;
    }
  }
  throw new Error('NameNotFound: ' + name);
}

const isDuplicateName = function ( user ) {
  if ( user.hasOwnProperty( 'name' )) {
    try {
      const old_user = getUserByName( user.name );
      return user.user_id !== old_user.user_id;
    } catch (ex) {
      if (ex.message.match( /NameNotFound/ )) {
        return false;
      } else {
        throw ex;
      }
    }
  } else {
    return false;
  }
}
