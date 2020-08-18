/**
 *  api/freetRouter.js
 *
 *  Freet management API
 */

const express = require( 'express' );
const router = express.Router();

const routerUtils = require( './routerUtils' );
const freetService = require('../services/freetService');


//------------------------------------------------------
//            START UNAUTHENTICATED ROUTES
//------------------------------------------------------

/**
* Get all freets
* @name GET/api/freet
* @return {200} - if there are any freets, a json array with
* all freets;
* The freet object must include at least the following fields:
* - freet_id  : the freet identifier
* - message   : the message
* - votes     : the vote count
* - author    : the author's name
* @return {204} - if there are no freets.
*/
router.get( '/', function ( req, res, next ) {
  freetService.search( req.query )
  .then(( freetList )=>{
    if( freetList.length === 0 ) {
      res.status(204).end();
    } else {
      res.status(200).json(freetList).end();
    }
  })
  .catch(( err )=>{
    handleError( err, res, next );
  });
});

/**
 * Search freets by author.
 *
 * @name GET/api/freet?q=:user_id
 * @param {string} author - freet author username
 * @return {200} - if there are any freets by author, a 
 *  json array of freets.
 * @return {204} - if there are no freets by author.
 */
router.get( '/?author=:username', function ( req, res ) {
  res.status(500).send({message: 'unimplemented'}).end();
});

//------------------------------------------------------
//            END UNAUTHENTICATED ROUTES
//------------------------------------------------------

//------------------------------------------------------
//            START AUTHENTICATED ROUTES
//------------------------------------------------------

router.all( '*', routerUtils.checkAuthenticated );/*, (req,res,next)=>{
  console.log(req.method);
  console.log(req.body);
  next();
});*/
 
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
router.post( '/', function ( req, res, next ) {
  const author_id = req.session.user_id;
  const message = req.body.message;

  freetService.create( author_id, message )
  .then(( freet_id )=>{
    const url = '/api/freet/' + freet_id;
    res.status(201).location(url).end();
  })
  .catch(( err ) =>{
    handleError( err, res, next );
  });
});
  
/**
 * Edit a freet.
 *
 * A freet with the given id must already exist. 
 *
 * @name PUT/api/freet/:freet_id
 * @param {string} freet_id - freet identifier
 * @param {string} message - text message, 140 characters 
 *  long or less
 * @return {204} - the freet was successfully edited
 * @error {400} - if the message is too long
 * @error {401} - if not logged in
 * @error {403} - if the user is not the author
 * @error {404} - if there is no freet with freet_id
 */
router.put( '/:freet_id', function ( req, res, next ) {
  const user_id = req.session.user_id;
  let freet = req.body;

  freet.freet_id = req.params.freet_id;

  freetService.edit( user_id, freet )
  .then(()=>{
    res.status(204).end();
  })
  .catch(( err )=>{
    handleError( err, res, next );
  });
});
   
 /**
  * Delete a freet
  * @name DELETE/api/freet/:freet_id
  * @param {string} freet_id - freet identifier
  * @return {204}  - the freet was deleted
  * @error  {401}  - if not logged in
  * @error  {403}  - if the user is not the author
  * @error  {404}  - if there is no freet_id freet
  */
router.delete( '/:freet_id', function ( req, res, next ) {
  const user_id = req.session.user_id;
  const freet_id = req.params.freet_id;

  freetService.delete( user_id, freet_id )
  .then((resolve,reject)=>{
    res.status(204).end();
  })
  .catch(( err )=>{
    handleError( err, res, next );
  });
});

    
/**
 * Upvote or downvote a freet.
 *
 * @name POST/api/freet/:freet_id/vote
 * @param {string} freet_id - freet identifier
 * @param {string} direction - a query parameter, one of:
 *                             "up"   for upvote
 *                             "down" for downvote
 * @return {204} - the freet was successfully voted.
 * @error  {401} - if not logged in
 * @error  {403} - if the user is the author
 * @error  {404} - there is no freet with freet_id
 */
router.post( '/:freet_id/vote', ( req, res, next ) => {
  const 
    user_id   = req.session.user_id,
    freet_id  = req.params.freet_id,
    direction = req.body.direction
  ;

  let is_upvote;
  try {
    is_upvote = isUpvote( direction );
  } catch( err ) {
    handleError( err, res, next );
    return;
  }
  freetService.vote( user_id, freet_id, is_upvote )
  .then(()=>{
    res.status(204).end();
  })
  .catch((err)=>{
    handleError( err, res, next );
    return;
  });
});

//------------------------------------------------------
//            END AUTHENTICATED ROUTES
//------------------------------------------------------


//--------------------------------------------------
//              START PRIVATE FUNCTIONS
//--------------------------------------------------

const handleError = function ( err, res, next ) {
  console.log(err);

  let res_status;

  if ( err.message.match( /MessageTooLong/ )) {
    res_status = 400;
  } else if ( err.message.match( /InvalidDirection/ )) {
    res_status = 400;
  } else if (err.message.match( /NotAuthorized/ )) {
    res_status = 403;
  } else if (err.message.match( /FreetNotFound/ )) {
    res_status = 404;
  } else {
    res.status(500).end();
    next( err );
    return;
  }

  res.status( res_status ).json( err ).end();

}

/**
* @throws {InvalidDirection} - if direction is not 'up' or 'down'
*/
const isUpvote = function ( direction ) {
  if ( direction == 'up' ) {
    return true;
  } else if ( direction == 'down' ) {
    return false;
  } else {
    throw new Error('InvalidDirection: ' + direction);
  }

}

module.exports = router;
