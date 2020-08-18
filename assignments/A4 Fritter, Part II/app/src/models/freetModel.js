/**
* models/freetModel.js
*
* Freet model module, responsible for freet storage.
*/

const uuid = require('UUID');

const freetMap            = new Map(),  // the representation
      max_message_length  = 140,
      editable_properties = ['message', 'votes'];

// Abstracion Function:
//   The key is the freet id, which is unique for each freet
//   The value represents the freet, which has properties:
//   - freet_id   : the freet identifier
//   - author_id  : the freet author's user id
//   - message    : the freet message
//   - votes      : the number of votes
//    
// Representation Invariant:
//  The key must be a string
//  The value must be an object
//  The value must be frozen
//  The value must have freet_id, author_id, message and votes properties
//  freet_id must be a string
//  freet_id must be equal to the key
//  author_id must be a string
//  message must be a string
//  message must be at most 140 characters long
//  TODO author_id must exist in the user model
//  votes must be an integer
//  
// Safety From Representation Exposure:
//  all freet properties are strings, and hence immutable, so can be 
//    safely shared
//  freet object are freezed before storage, so can be safely shared
//  a freet object is also freezed before storage after editing

const checkRep = function () {
  freetMap.forEach( ( value, key ) => {

    if (typeof( key ) !== 'string') {
      throw new Error('key is not a string: ' + key);
    }

    if (typeof( value ) !== 'object') {
      throw new Error('value is not an object: '
                      + JSON.stringify( value ));
    }

    if (!Object.isFrozen( value )) {
      throw new Error('value is not frozen: ' + JSON.stringify( value ));
    }

    ['freet_id', 'author_id', 'message'].forEach(( property ) => {
      if (!value.hasOwnProperty( property )) {
        throw new Error('value has no ' + property + ' property: ' 
                        + JSON.stringify( value ));
      }
      if (typeof( value[ property ] ) !== 'string') {
      }
    });

    if ( value.freet_id !== key ) {
      throw new Error('value.freet_id !== key: ' 
                      + value.freet_id + ' !== ' + key);
    }

    if ( value.message.length > max_message_length ) {
      throw new Error('message lenght is more than ' + max_message_length
                      + ' characters: ' + message.length );
    }

    if (!value.hasOwnProperty( 'votes' )) {
      throw new Error('value has no votes property: ' 
                      + JSON.stringify( value ));
    }

    if (!Number.isInteger( value.votes )) {
      throw new Error('votes is not an integer: ' + value.votes);
    }

  });
}

//---------------------------------------------------
//                  START MODIFIERS
//---------------------------------------------------

/**
* Insert a freet into the storage.
*
* @param {Object} - an object with an author_id, a message and votes.
* @return {Promise} - resolves to a unique freet identifier
* @throws {MessageTooLong} - if the message is more than 140 characters long
*/
module.exports.insert = function ( freet ) {
  return new Promise((resolve,reject)=>{

    if (checkMessageIsTooLong( freet, reject )) {
      return;
    }

    freet.freet_id = uuid.v4();

    Object.freeze( freet );

    freetMap.set( freet.freet_id, freet );

    checkRep();

    resolve( freet.freet_id );

  });
}


/**
* Delete a freet.
*
* @param {string} freet_id - the freet identifier
* @throws FreetNotFound - if there is no freet with given identifier
*/
module.exports.delete = function( freet_id ) {
  return new Promise((resolve,reject)=>{
    if (freetMap.delete( freet_id )) {
      checkRep();
      resolve();
    } else {
      reject( new Error( 'FreetNotFound' ));
    }
  });
}

/**
* Edit a freet.
*
* Only the following freet properties can be edited:
* - message
* - votes
*
* @param {Object} - a freet object
* @throws {MessageTooLong} - if the message has more than 140 characters
*/
module.exports.edit = function( freet ) {
  return new Promise((resolve,reject)=>{

    if (checkMessageIsTooLong( freet, reject )) {
      return;
    }

    const old_freet = freetMap.get( freet.freet_id );

    let new_freet = {};
    Object.assign( new_freet, old_freet );

    editable_properties.forEach(( key )=>{
      if ( freet.hasOwnProperty( key )) {
        new_freet[ key ] = freet[ key ];
      }
    });

    Object.freeze( new_freet );

    freetMap.set( old_freet.freet_id, new_freet );

    checkRep();

    resolve();
  });
}

//---------------------------------------------------
//                  END MODIFIERS
//---------------------------------------------------


//---------------------------------------------------
//                  START OBSERVERS
//---------------------------------------------------

/**
* Get a freet.
*
* @param {string} freet_id - the freet identifier
* @return {Object} - the freet object
* @throws FreetNotFound - if there is no freet with given identifier
*/
module.exports.get = function( freet_id ) {
  return new Promise((resolve,reject)=>{
    const freet = freetMap.get( freet_id );
    if ( freet ) {
      resolve( freet );
    } else {
      reject( new Error('FreetNotFound') );
    }
  });
}

/**
* Search tweets that have properties with certain values.
*
* @param {object} query - properties with their values
* @return {Array} - freets that were found 
*/
module.exports.search = function ( query={} ) {
  return new Promise((resolve,reject)=>{
    const freet_list = Array.from( freetMap.values() ).filter(( freet )=>{
      return doesQueryMatchFreet( query, freet );
    });
    resolve( freet_list );
  });
}

//---------------------------------------------------
//                  END OBSERVERS
//---------------------------------------------------

//---------------------------------------------------
//              START PRIVATE FUNCTIONS
//---------------------------------------------------

/**
* Rejects if message too long
* @return true  - if the message is too long
*         false - otherwise
*/
const checkMessageIsTooLong = function ( freet, reject ) {
  if ( freet.message.length > max_message_length ) {
    reject( new Error('MessageTooLong: ' + freet.message ));
    return true;
  } else {
    return false;
  }
}

/**
* @return {boolean} - true if all properties in the query are
* equal to all the some properties in the freet
*/
const doesQueryMatchFreet = function ( query, freet ) {
  const query_keys = Object.keys( query );
  const matching_key_list = 
    query_keys.filter(( key )=>{
      return freet[ key ] === query[ key ];
    });

  return matching_key_list.length === query_keys.length;
}