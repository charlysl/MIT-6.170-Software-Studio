const express = require( 'express' );
const path    = require( 'path'   ); //no need to install, causes error!
const logger  = require( 'morgan' ); //no need to install (with express?)
const session = require( 'express-session' );

const router = require( './api/router');
//const userRouter = require('./api/userRouter');

const app = express();

app.use( logger( 'dev' ) ); //just 'logger' doesn't work
app.use( express.json() ); //so that the body can be json
app.use( express.urlencoded( { extended: false } ) ); //otherwise body not parsed
app.use( express.static( path.join(__dirname, 'public' )));


app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use( '/api', router );

app.use( ( err, req, res, next ) => {
  // every time there is a 500, call next(ex)
  // it will be handled here
  console.log( '500: internal server exception:' ); 
  console.log( err );
});

// needed for testing with jest and supertests
// "You want to allow each test file to start a server 
//  on their own."
// see https://zellwk.com/blog/endpoint-testing/
module.exports = app;

