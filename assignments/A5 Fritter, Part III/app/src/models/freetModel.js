/**
* models/freetModel.js
*
* Freet model module, responsible for freet storage.
*/

const uuid = require('UUID');

const userModel = require('./userModel');

const freetMap            = new Map(),  // the representation
      max_message_length  = 140,
      editable_properties = ['message', 'votes'];

//mockPopulate();

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
* @return {Object} - the freet object,
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
    })
    .map(( freet )=>{
       // this is a bit of a hack, because I didn't
       // ADD the AUTHOR NAME to each freet in the 
       // results; it is important to note that the
       // author name must not be stored with the 
       // freet, given that the user can change his name
      const new_freet = Object.assign( {}, freet );
      new_freet.author = userModel.getNameByUserId( freet.author_id );
      // no need to freeze new_freet, given that it is not aliased
      return new_freet;
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


/**
* Populate with mock freets to ease development; may break some tests.
*/
function mockPopulate() {
  console.warn('Mock populating freetMap');

  const freets = [
    {   
      freet_id:   'f011f172-3c43-40ea-b6c6-1a29311d1d8c', 
      author_id:  '5212f9a9-3b9e-4750-a78d-0ad643a3c353' 
    },
    { 
      freet_id:   'e6d728f0-54fa-414c-b5a4-0561d5aef4fc', 
      author_id:  '5212f9a9-3b9e-4750-a78d-0ad643a3c353' 
    },
    { 
      freet_id:   'd3331ba7-845b-4069-a341-0a42d2d23ee2', 
      author_id:  '63948624-649e-4e99-bdbe-36e3ee0f1046' 
    },
    { 
      freet_id:   'ca5c0495-a145-439f-83b1-30832dc4d67d', 
      author_id:  '63948624-649e-4e99-bdbe-36e3ee0f1046' 
    },
    { 
      freet_id:   '09abaa41-deff-4937-b334-287fd0be54b8', 
      author_id:  '63948624-649e-4e99-bdbe-36e3ee0f1046' 
    },
  ];

  freetMap.set( '02ed23c0-9cfe-4a5d-bf06-d3ec254cf7ef', Object.freeze({
    freet_id:   '02ed23c0-9cfe-4a5d-bf06-d3ec254cf7ef', 
    author_id:  '16e91fef-a6e1-4459-9b00-f80a65e458fa',
    votes: 0,
    message: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  }));

  freets.forEach(( freet, idx ) => {
    freet.votes = idx;
    freet.message = 'message ' + idx;
    freetMap.set( freet.freet_id, Object.freeze(freet) );
  });
}
