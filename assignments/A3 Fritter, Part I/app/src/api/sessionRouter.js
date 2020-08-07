/**
 *  api/sessionRouter.js
 *  
 *  The session management API
 */

const express = require( 'express' );
const router = express.Router();

const userService = require('../services/userService');

/**
 *  Login the user, creating a session.
 *
 *  The user must have already been created.
 *
 *  @name POST/api/session/login
 *  @param  {string}  name      - the user's login name
 *  @param  {string}  password  - the user's password
 *  @error  {403} - the server did not accept the 
 *                  authentication
 *  @return {204} - the user was logged in succesfully
 */
router.post( '/login', function ( req, res ) {
  userService.authenticate( req.body.name, req.body.password)
  .then(( user_id ) => {
    req.session.user_id = user_id;
    res.status(204).end();
  })
  .catch(( ex ) => {
    console.log('ex: ' + ex.toString());
    if (ex.message.match(/InvalidCredentials/)) {
      res.status(403).send(ex).end();
    } else {
      res.status(500).send(ex).end();
    }
  });
});

 
/**
 *  Logout the user, destroying the session.
 *
 *  @name DELETE/api/session
 *  @return {204} - the user has been succesfully logged out
 */
router.delete( '/logout', function ( req, res ) {
  delete req.session.user_id;
  res.status(204).end();
});
 
 module.exports = router;
 