import axios from 'axios';

/**
* Request Fritter server to create a Freet.
*
* @param {string} fields.message - the message, must be at most 140 characters.
* @return {string} - new freet id
*/
const create = async function ( fields ) {
  try {
    const res = await axios.post( '/api/freet', fields );
    console.log('freetAPI.create', res);
    const location = res.headers.location;
    const freet_id = location.match('/([^/]+)$')[1];
    return freet_id;
  } catch (err) {
    handleError( err );
  }
}

/**
* Request Fritter server to create a Freet.
*
* @param {string} fields.message - the message, must be at most 140 characters.
*/
const remove = async function ( fields ) {
  try {
    await axios.delete( '/api/freet/' + fields.freet_id );
  } catch (err) {
    handleError( err );
  }
}

/**
* Request Fritter server to edit a Freet.
*
* @param {string} fields.freet_id - the freet id
* @param {string} fields.message  - the message, must be at most 140 characters
*/
const edit = async function ( fields ) {
  const message = fields.message;
  try {
    await axios.put( '/api/freet/' + fields.freet_id, { message } );
  } catch (err) {
    handleError( err );
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
    handleError( err );
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
    handleError( err );
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

function handleError ( err ) {
  throw new Error('Caught unexpected exception: ' + err.response);
}

export default { create, remove, edit, search, upvote, downvote };
