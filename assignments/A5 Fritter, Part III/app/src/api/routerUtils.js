/**
* api/routerUtils.js
*
* This module contains router utility functions
*/

//----------------------------------------------------
//                START MIDDLEWARE
//----------------------------------------------------

/**
* Check if the user has been authenticated.
*
* @param {Request} req - the request
* @param {Response} res - the response
* @param {Function} next - to continue with the next middleware
* @return {next()} - if the has been authenticated
* @throws {401} - if the user has not been authenticated
*/
module.exports.checkAuthenticated = function ( req, res, next ) {
  const user_id = req.session.user_id;

  if ( user_id === undefined ) {
    res.status(401).end();
  } else {
    next();
  }
}

//----------------------------------------------------
//                END MIDDLEWARE
//----------------------------------------------------
