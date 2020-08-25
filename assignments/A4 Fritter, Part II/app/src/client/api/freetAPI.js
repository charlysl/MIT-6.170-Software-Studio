import axios from 'axios';

/**
* Request Fritter server to create a Freet.
*
* @param {string} fields.message - the message, must be at most 140 characters.
*/
const create = async function ( fields ) {
  try {
    await axios.post( '/api/freet', fields );
  } catch (err) {
      throw new Error('Caught unexpected exception: ' + err.response);
  }
}


/**
* Request Fritter server to search for Freets.
*
* @param {string} author - the author's name (optional)
* @return {Array{Freet}} - the freets by author
*/
const search = async function ( author ) {

  const query = buildSearchQuery( author );

  try {
    const res = await axios.get( '/api/freet' + query );
    return res.data;
  } catch (err) {
      throw new Error('Caught unexpected exception: ' + err.response);
  }
}

/**
* Request Fritter server to upvote a Freet.
*
* @param {string} freet_id - the freet identifier
*/
const upvote = async function ( freet_id ) {
  vote( freet_id, 'up' );
}

/**
* Request Fritter server to downvote a Freet.
*
* @param {string} freet_id - the freet identifier
*/
const downvote = async function ( freet_id ) {
  vote( freet_id, 'down' );
}

const vote = async function ( freet_id, direction ) {
  try {
    await axios.post( '/api/freet/' + freet_id + '/vote', {direction} );
  } catch (err) {
      throw new Error('Caught unexpected exception: ' + err.response);
  }
}

const buildSearchQuery = function ( author ) {
  let query;
  if ( author ) {
    query = '?author=' + author;
  } else {
    query = '';
  }
  return query;
}

export default { create, search, upvote, downvote };
