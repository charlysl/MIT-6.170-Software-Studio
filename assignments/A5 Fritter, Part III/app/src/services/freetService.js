/**
* services/freetService.js
*
* Freet services module.
*/

const freetModel = require('../models/freetModel');
const freetSqlModel = require('../models/postgresql/freetModel');
const userModel = require('../models/userModel');
const userSqlModel = require('../models/postgresql/userModel');

/**
* Create a new freet.
*
* The freet will be created with 0 votes.
*
* @param {string} author_id - the freet author's user id
* @param {string} message - the message; must be at most 140 characters long
* @return {string} - the freet's identifier
* @throws {MessageTooLong} - if the message lenght is more than 140 characters
*/
module.exports.create = function ( author_id, message ) {
  const freet = {
    author_id,
    message,
    votes: 0
  };

  return new Promise((resolve,reject)=>{
    freetSqlModel.insert( freet )
    .then(( freet_id )=>{
      resolve( freet_id )
    })
    .catch(( err )=>{
      reject( err );
    });
  });

}

/**
* Delete a freet.
*
* @param {string} user_id   - the user id that wants to delete the freet
* @param {string} freet_id  - the id of the freet that is to be deleted
* @throws {NotAuthorized} - if the user is not the freet's author
* @throws {FreetNotFound} - if there is no freet with the given id
*/
module.exports.delete = function ( user_id, freet_id ) {
  return modifyFreet( user_id, 
                      freet_id, 
                      () => freetSqlModel.delete( freet_id )
  );
}

/**
* Edit a freet.
*
* @param {string} user_id - the user id that is editting the freet
* @param {objet} freet - the freet object; must have author_id, freet_id
* message fields
* @throws {MessageTooLong} - if the message length is more than 140 characters
* @throws {NotAuthorized}  - if the user is not the freet's author
* @throws {FreetNotFound}  - if there is no freet with the given id
*/
module.exports.edit = function ( user_id, freet ) {
  return modifyFreet( user_id, freet.freet_id, ()=>{
    return freetModel.edit( freet )
  });
}

/**
* Search freets.
*
* @param {object} query - the properties that freets must match;
* if empty, all freets will be returned
* @return {Array} - a list of tweets
*/
module.exports.search = function ( query={} ) {

  return new Promise((resolve,reject)=>{
    const model_query = {};
    Object.assign(model_query, query);

    //replace author with author_id
    if ( query.hasOwnProperty( 'author' )) {
      delete model_query.author;
      userSqlModel.get( query.author )
      .then(( user )=>{
        model_query.author_id = user.user_id;
        resolve( model_query );
      })
      .catch(( err )=>{
        if (err.message.match(/NameNotFound/)) {
          resolve( null )
        }
      })
    } else {
      resolve( model_query );
    }
  })
  .then(( model_query )=>{
    if ( model_query ) {
      return freetSqlModel.search( model_query );
    } else {
      return [];
    }
  });

}

/**
* Upvote or downvote a freet.
* @param {string} freet_id - the freet_id
* @param {boolean} is_upvote - if true  is an upvote
*                            - if false is a  downvote
* @throws {NotAuthorized}      - if the user is the author
* @throws {FreetNotFound} - if there is no freet with freet_id
*/
module.exports.vote = function ( user_id, freet_id, is_upvote ) {
  return new Promise((resolve,reject)=>{
    freetModel.get( freet_id )
    .then(( freet )=>{
      if ( user_id === freet.author_id ) {
        reject( new Error('NotAuthorized') );
        return;
      } else {
        const new_freet = {};
        Object.assign( new_freet, freet );

        const delta = getVoteDelta( is_upvote );
        new_freet.votes += delta;

        return freetModel.edit( new_freet );
      }
    })
    .then(()=>{
      resolve();
    })
    .catch(( err )=>{
      reject( err );
    }) 
  });
}


//---------------------------------------------------------
//                PRIVATE FUNCTIONS
//---------------------------------------------------------

const modifyFreet = function ( user_id, freet_id, fn ) {
  return new Promise((resolve,reject)=>{
    freetSqlModel.get( freet_id )
    .then(( old_freet )=>{
      if ( user_id === old_freet.author_id ) {
        fn()
        .then(()=>{
          resolve();
        })
        .catch(( err )=>{
          reject( err );
        });
      } else {
        reject(new Error('NotAuthorized'));
      }
    })
    .catch(( err )=>{
      reject( err );
    });
  });
}

const getVoteDelta = function ( is_upvote ) {
  if ( is_upvote ) {
    return 1;
  } else {
    return -1;
  }
}


