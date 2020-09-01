/**
 *  api/userRouter.js
 *
 *  The user management API
 */
 
const express = require( 'express' );
const router = express.Router();

const routerUtils = require( './routerUtils' );

const userService = require( '../services/userService' );



/**
* Create user account
*
* @name POST/user
* @param {string} name - The username, must be unique
* @param {string} password - The user's login password
* @return {201} - if the user was succesfully created, a
* Location header to URL /api/user/:user_id is returned
* @throws {400} - if name or password are missing
* @throws {403} - if the name is not unique
*/
router.post( '/', function ( req, res, next ) {
  const
    username = req.body.name,
    password = req.body.password
  ;

  userService.create( username, password )
  .then(( user_id ) => {
    const location = '/api/user/' + user_id;
    res.location(location).status(201).end();
  })
  .catch(( err ) => {
    handleError( err, req, res, next );
  });
});

router.all( '*', routerUtils.checkAuthenticated );

/**
* Edit user account
*
* All parameters are optional.
* If a parameter is missing, the old value will be
* preserved
* 
* @name PUT/user
* @param {string} name - The user's new login name
* @param {string} password - The user's new login password
* @return {204} - if the use was succesfully edited
* @error {401} - if the user is not logged in
* @error {403} - if the new name is not unique
*/
router.put( '/', function ( req, res, next ) {
  const name = req.body.name;
  const password = req.body.password;

  const user = { user_id :   req.session.user_id };

  if ( name !== undefined ) {
    user.name = name;
  }

  if ( password !== undefined ) {
    user.password = password;
  }

  userService.edit( user )
  .then(()=>{
    res.status(204).end();
  })
  .catch(( err )=>{
    handleError( err, req, res, next );
  });
});

/**
* Remove user account
*
* @name DELETE/user
* @return {204} - the user account was succesfully removed
* @error {401} - if the user is not logged in
*/
router.delete( '/', function ( req, res ) {
  const user_id = req.session.user_id;
  userService.remove( user_id )
  .then(()=>{
    res.status(204).end();
  })
});

const handleError = function ( err, req, res, next ) {
  if (        err.message.match( /MissingParameter/ ) ) {
     res.status(400).send().end();
  } else if ( err.message.match( /DuplicateName/ ) ) {
     res.status(403).send().end();
  } else {
    res.status(500).send().end();
    next(err);
  }
}

module.exports = router;

