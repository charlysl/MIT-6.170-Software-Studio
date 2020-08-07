const app = require('../../app');
const supertest = require('supertest');

/**
* Testing Strategy for POST/api/user
*
* Partition input as follows:
*
* name is unique: yes, no
*
* Observer: POST/api/login
*
* Cover each input value at least once.
*
*/

describe('POST/api/user', ()=>{
  const name = 'api_user';
  const password = 'api_password';

  test('creates a new user', (done)=>{
    supertest(app)
      .post('/api/user')
      .send({name, password})
      .expect(201)
      .expect('Location', /\/api\/user\/.+/)
      .end((err,res)=>{
        if (err) return done(err);
        done();
      });
  });

  test('does not allow duplicate user names', (done)=>{
    supertest(app)
      .post('/api/user')
      .send({name, password})
      .expect(403)
      .end((err,res)=>{
        if (err) return done(err);
        done();
      });
  });
});


/**
* Testing Strategy for PUT/api/user
*
* Partition input as follows:
*
* name is given: yes, no
* password is given: yes, no
* name is duplicate: yes, no
* name remains the same: yes, no
* password remains the same: yes, no
* user is logged in: yes, no
*
* Setup: POST/api/user, POST/api/login
* Observer: POST/api/logout, POST/api/login
*
* Cover each input value at least once:
* 
* [new_name, old_password] -> {204}
* [old_name, new_password] -> {204}
* [dup_name, any_password] -> {403}
* [any_name, any_password], not logged in -> {401}
* [old_name] -> {204}
* [old_password] -> {204}
* [new_name] -> {204}
* [new_password] -> {204}
* [dup_name] -> {403}
*/

const name = 'put_name';
const dup_name = 'dup_name';
const password = 'put_password';

describe('PUT/api/user', () => {

  let user_id;

  beforeEach( () => {
    return supertest(app)
    .post('/api/user')
    .send({name,password})
    .then((res)=>{
      return supertest(app)
      .post('/api/session/login')
      .send({name,password});
    });
  });

  afterEach( () => {
    return supertest(app)
    .delete('/api/user')
    .send()
    .then((res)=>{
      return supertest(app)
      .delete('/api/session/logout')
      send();
    });
  });


  it('returns 204 if a user is edited with a new name', 
    (done)=>{
      const fields = { name: 'a_new_name', password };
      testEditUser( fields, 204, done );
  });

  it('returns 204 if a user is edited with a new password', 
    (done)=>{
      const fields = { name, password: 'a_new_password' };
      testEditUser( fields, 204, done );
  });


  it('throws 403 if a user is edited with a duplicate name', 
    (done)=>{
      createUser( dup_name, password );
      const fields = { name: dup_name, password };
      testEditUser ( fields, 403, done )
  });

  it('throws 401 if a user is edited without loging in', 
    (done)=>{
      logout();
      const fields = { name, password };
      testEditUser( fields, 401, done );
  });

  it('returns 204 if a user is edited with only old name', 
    (done)=>{
      const fields = { name };
      testEditUser( fields, 204, done );
  });

  it('returns 204 if a user is edited with only old password', 
    (done)=>{
      const fields = { password };
      testEditUser( fields, 204, done );
  });

  it('returns 204 if a user is edited with only new name', 
    (done)=>{
      const fields = { name: 'new_name' };
      testEditUser( fields, 204, done );
  });

  it('returns 204 if a user is edited with only new password', 
    (done)=>{
      const fields = { password: 'new_password' };
      testEditUser( fields, 204, done );
  });

  it('throws 403 if a user is edited with duplicate name', 
    (done)=>{
      const fields = { name: dup_name };
      testEditUser( fields, 403, done );
  });


});

const createUser = function ( name, password ) {
  supertest(app)
  .post('/api/user')
  .send({name,password})
  .end((err,res) => { // must call end
  });
}

const testEditUser = function ( fields, status, done ) {
  supertest(app)
  .put('/api/user')
  .send(fields)
  .expect(status)
  .end((err,res) => {
    if (err) return done(err);
    done();
  });
}

const login = function ( name, password ) {
  supertest(app)
  .post('/api/session/login')
  .send({name,password})
  .end();
}

const logout = function () {
  supertest(app)
  .delete('/api/session/logout')
  .send()
  .end();
}

const getUserIdFromResponse = function ( res ) {
  const location = res.headers.location;
  return location.substring( location.lastIndexOf( '/') );
}


