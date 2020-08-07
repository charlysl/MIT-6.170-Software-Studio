
const express = require( 'express' );

const userRouter = require('./userRouter');
const sessionRouter = require('./sessionRouter');
const fritterRouter = require( './fritterRouter' );

const router = express.Router();

router.use( '/user', userRouter );
router.use( '/session' , sessionRouter );
router.use( '/fritter', fritterRouter );

module.exports = router;
