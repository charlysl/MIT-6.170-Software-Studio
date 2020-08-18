
const express = require( 'express' );

const userRouter = require('./userRouter');
const sessionRouter = require('./sessionRouter');
const freetRouter = require( './freetRouter' );

const router = express.Router();

router.use( '/user', userRouter );
router.use( '/session' , sessionRouter );
router.use( '/freet', freetRouter );

module.exports = router;
