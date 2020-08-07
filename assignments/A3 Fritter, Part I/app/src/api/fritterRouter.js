/**
 *  api/fritterRouter.js
 *
 *  Fritter management API
 */

const express = require( 'express' );
const router = express.Router();
 
 /**
  * Create a new freet.
  *
  * The user id is the author, and has 0 votes.
  *
  * @name POST/api/freet
  * @param {string} message - text message, 140 characters 
  * long or less
  * @return {201} {string} - freet_id (and Location header 
  * with /api/freet/:id URL to freet ) 
  * @error  {400} - if the message is too long
  * @error  {401} - if not logged in
  */
router.post( '/', function ( req, res ) {
  res.status(500).send({message: 'unimplemented'}).end();
});
  
  /**
   * Edit a freet.
   *
   * A freet with the given id must already exist. 
   *
   * @name PUT/api/freet
   * @param {string} freet_id - freet identifier
   * @param {string} message - text message, 140 characters 
   *  long or less
   * @return {200} - the freet was successfully edited
   * @error {400} - if the message is too long
   * @error {401} - if not logged in
   * @error {403} - if the user is not the author
   * @error {404} - if there is no freet with freet_id
   */
router.put( '/', function ( req, res ) {
  res.status(500).send({message: 'unimplemented'}).end();
});
   
 /**
  * Delete a freet
  * @name DELETE/api/freet
  * @param {string} freet_id - freet identifier
  * @return {200} - the freet was deleted
  * @error {401} - if not logged in
  * @error {403} - if the user is not the author
  */
router.delete( '/', function ( req, res ) {
  res.status(500).send({message: 'unimplemented'}).end();
});

    
/**
 * Upvote a tweet
 * @name POST/api/freet/:freet_id/upvote
 * @param {string} freet_id - freet identifier
 * @return {201} - the freet was successfully upvoted,
 *  a Location header with URL /api/freet/:id is also sent.
 * @error {401} - if not logged in
 * @error {403} - if the user is the author
 * @error {404} - there is no freet with freet_id
 */
router.post( '/:freet_id/upvote', function ( req, res ) {
  res.status(500).send({message: 'unimplemented'}).end();
});

/**
 * Downvote a freet
 * @name POST/api/freet/:freet_id/downvote
 * @param {string} freet_id - freet identifier
 * @return {201} - the freet was successfully downvoted,
 *  a Location header with URL /api/freet/:id is also sent.
 * @error {401} - if not logged in
 * @error {403} - if the user is the author
 * @error {404} - there is no freet with freet_id
 */
router.post( '/:freet_id/downvote', function ( req, res ) {
  res.status(500).send({message: 'unimplemented'}).end();
});

/**
* Get all freets
* @name GET/api/freet
* @return {200} - if there are any freets, a json array with
* all freets.
* @return {204} - if there are no freets.
*/
router.get( '/', function ( req, res ) {
  res.status(500).send({message: 'unimplemented'}).end();
});

/**
 * Search freets by author.
 *
 * @name GET/api/freet?q=:user_id
 * @param {string} user_id - freet author user_id
 * @return {200} - if there are any freets by user_id, a 
 *  json array of freets.
 * @return {204} - if there are no freets by user_id.
 */
router.get( '/?author=:user_id', function ( req, res ) {
  res.status(500).send({message: 'unimplemented'}).end();
});

module.exports = router;
