const app = require( '../../app' );
const supertest = require( 'supertest' );

/**
* Testing Strategy for POST/session/login 
*
*   Partition input as follows:
*     name registered: yes, no
*     password matches: yes, no
*
*   Conver each input value at least once:
*
*   [registered_name, matching_password] => {200}
*   [registered_name, non_matching_password] => {403}
*   [non_registered_name, any_password] => {403}
*
*   Setup:
*     POST/user
*   Observers:
*     PUT/api/user
*/

describe('POST/api/session/login', () => {

  beforeEach( () => {
    supertest(app)
      .post('/api/user' )
      .send( { name: 'aname', password: 'apassword' } )
      .end( ( err, res ) => {
        //empty
      });
  });

  it('logs in with valid credentials', ( done ) => {
    supertest(app)
      .post( '/api/session/login' )
      .send( { name: 'aname', password: 'apassword' } )
      .expect(204)
      .end( ( err, res ) => {
        if ( err ) return done( err );
        done();
      });
  });

  it('does not login unregistered user', ( done ) => {
    supertest(app)
      .post( '/api/session/login' )
      .send( { name: 'not_registered', password: 'apassword'})
      .expect( 403 )
      .end( (err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('does not login wrong password', ( done ) => {
    supertest(app)
      .post('/api/session/login')
      .send({name:'aname', password:'wrong_password'})
      .expect(403)
      .end((err,res)=>{
        if (err) return done(err);
        done();
      });
  });

});


/**
* Testing Strategy for DELETE/api/session/logout
*
* Partition input space as follows:
*
* user is already loggen in: yes
*
* Setup: POST/api/session/login
* Observer: PUT/api/user/
*/

describe('DELETE/api/session/logout', () => {
  it('logs out', (done)=>{
    supertest(app)
      .delete('/api/session/logout')
      .send()
      .expect(204)
      .end((err,res)=>{
        if (err) return done(err);
        done(err);
      })
  })
});

