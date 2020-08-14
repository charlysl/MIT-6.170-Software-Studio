const supertest = require('supertest');
const app = require('../../app');
const freetRouter = require('../../api/freetRouter');

/**
* Testing Strategy for /POST/api/freet
*
* Partition input as follows:
*
* message length: 0, 0 < 140, 140, >140
* logged in: yes, no
*
* Cover all values at least once:
*
* Not logged in,  ['my message']      -> 401
* Logged in,      ['']                -> 201, Location=/api/freet/:freet_id
* Logged in,      ['my message']      -> 201, Location=/api/freet/:freet_id
* Logged in,      [140 char message]  -> 201, Location=/api/freet/:freet_id
* Logged in,      [141 char message]  -> 400
*
* Setup:  /POST/api/user
*         /POST/api/session/login
*         /DELETE/api/session/logout
*         /DELETE/api/user
* Observers:  /GET/api/freet
*/

describe('/POST/api/freet', ()=>{

  const agent = supertest.agent(app);

  beforeEach(()=>{
    return createUserAndLogin( agent );
  });
/*
  it('throws 401 when creating a tweet without first logging in', (done)=>{
    supertest(app) //new client session, which is not logged in
    .post('/api/freet')
    .send({message: 'a message'})
    .expect(401)
    .end((err,res)=>{
      if (err) done(err);
      done();
    })
  });
*/
  it('returns 201 when creating a tweet of length 0', (done)=>{
    return testPostFreet( agent, '', done );
  });

  it('returns 201 when creating a tweet of 0 < length < 140', (done)=>{
    return testPostFreet( agent, 'a message', done );
  });

  it('returns 201 when creating a tweet of length 140', (done)=>{
    const message = createMessageOfLength( 140 );
    return testPostFreet( agent, message, done );
  });

  it('throws 400 when creating a tweet of length > 140', (done)=>{
    const message = createMessageOfLength( 141 );

    return agent
      .post('/api/freet')
      .send({message})
      .expect(400)
      .end((err,res)=>{
        if (err) done(err);
        done();
      });
  });

  afterEach(()=>{
    return deleteUserAndLogout( agent );
  });

});

/**
* Testing Strategy for DELETE/api/freet
*
* Partition input as follows:
*
* logged in: yes, no
* user is the author: yes, no
* freet id exists: yes, no
*
* Cover each value at least once:
*
* Not logged in,                 [freet_id exists]         -> 401
* Logged in,      is author,     [freet_id exists]         -> 204
* Logged in,      is not author, [freet_id exists]         -> 403
* Logged in,      is author,     [freet_id does not exist] -> 404
*
* Setup:  POST/api/user
*         POST/api/session/login
*         POST/api/freet
*         ...
*         DELETE/api/user
*         DELETE/api/session/logout
* Observer: DELETE/api/freet -> 404
*/

describe('DELETE/api/freet', ()=>{

  const agent = supertest.agent(app); // a logged in session

  let ids = {};
  let fields = {};

  beforeEach(()=>{
    return createUserLoginAndFreet( agent, ids )
    .then(()=>{
      fields.freet_id = ids.freet_id;
    });
  });

  it('throws 401 when deleting a freet without logging in', (done)=>{
    testModifyFreetWithoutLoggingIn( agent, 'delete', fields, done );
  });

  it('returns 204 when the author deletes a freet that exists', (done)=>{
    testModifyFreetThatExists( agent, 'delete', fields, done )
  })

  it('returns 403 when not the author deletes a freet that exists', (done)=>{
    testModifyFreetNotAuthor( agent, 'delete', fields, done );
  })

  it('returns 404 when the author deletes a non-existing freet', (done)=>{
    fields.freet_id = 'some random freet id';
    testModifyNonExistingFreet( agent, 'delete', fields, done );
  });

  afterEach(()=>{
    return deleteUserAndLogout( agent );
  });

});

//-------------------------------------------------------
//              END TESTS FOR DELETE/api/freet
//-------------------------------------------------------

/**
* Testing Strategy for PUT/api/freet
*
* Partition input as follows:
*
* logged in: yes, no
* user is the author: yes, no
* freet id exists: yes, no
* message length: 0, 0 < 140, 140, >140
*
* Cover each value at least once:
*
* Logged in,      is author,     [freet_id, '']                 -> 204
* Logged in,      is author,     [freet_id, 'a message']        -> 204
* Logged in,      is author,     [freet_id, 140 char message]   -> 204
* Logged in,      is author,     [freet_id, 141 char message]   -> 400
* Not logged in,                 [freet_id, 'a message']        -> 401
* Logged in,      is not author, [freet_id, 'a message']        -> 403
* Logged in,      is author,     [wrong_id, 'a message']        -> 404

*
* Setup:  POST/api/user
*         POST/api/session/login
*         POST/api/freet
*         ...
*         DELETE/api/user
*         DELETE/api/session/logout
* Observer: GET/api/freet
*/

describe('PUT/api/freet', ()=>{

  const agent = supertest.agent(app); // a logged in session

  let ids = {};
  let fields = {};

  beforeEach(()=>{
    return createUserLoginAndFreet( agent, ids )
    .then(()=>{
      fields.freet_id = ids.freet_id;
    });
  });

  it('returns 204 when the author edits a freet that exists'
      + ' with a message of length 0', (done)=>{

    fields.message = '';
    testModifyFreetThatExists( agent, 'put', fields, done );
  });

  it('returns 204 when the author edits a freet that exists'
      + ' with a message of 0 < length < 140', (done)=>{

    fields.message = 'a message';
    testModifyFreetThatExists( agent, 'put', fields, done );
  });

  it('returns 204 when the author edits a freet that exists'
      + ' with a message of length 140', (done)=>{

    fields.message = createMessageOfLength( 140 );
    testModifyFreetThatExists( agent, 'put', fields, done );
  });

  it('returns 204 when the author edits a freet that exists'
      + ' with a message of length 141', (done)=>{

    fields.message = createMessageOfLength( 141 );

    return agent
      .put('/api/freet')
      .send(fields)
      .expect(400)
      .end((err,res)=>{
        if (err) done(err);
        done();
      });
  });

  it('throws 401 when editing a freet without logging in', (done)=>{
    testModifyFreetWithoutLoggingIn( agent, 'put', fields, done );
  });

  it('returns 403 when not the author edits a freet that exists', (done)=>{
    testModifyFreetNotAuthor( agent, 'put', fields, done );
  });

  it('returns 404 when the author edits a non-existing freet', (done)=>{
    fields.freet_id = 'some random freet id';
    testModifyNonExistingFreet( agent, 'put', fields, done );
  });

  afterEach(()=>{
    return deleteUserAndLogout( agent );
  });

});

//-------------------------------------------------------
//              END TESTS FOR PUT/api/freet
//-------------------------------------------------------

/**
* Testing Strategy for GET/api/freet
*
* Partition input as follows:
* 
* #freets in store: 0, 1, 3
* #freets per author: 0, 1, 2
* query: none, non-existing author, existing author
*
* name0: {}
* name1: {freet#0}
* name2: {freet#1, freet#2}
*
* Cover each value at least once:
*
* [{name0,1,2}, {},           ''              ] -> 204 
* [{name0,1,2}, {},           '?author=name0' ] -> 204
* [{name0,1,2}, {freet0},     ''              ] -> 200 {freet0}
* [{name0,1,2}, {freet0},     '?author=name1' ] -> 200 {freet#0}
* [{name0,1,2}, {freet0},     '?author=name2' ] -> 204
* [{name0,1,2}, {freet0,1,2}, ''              ] -> 200 {freet0,1,2}
* [{name0,1,2}, {freet0,1,2}, '?author=name0' ] -> 204
* [{name0,1,2}, {freet0,1,2}, '?author=name1' ] -> 200 {freet#0}
* [{name0,1,2}, {freet0,1,2}, '?author=name2' ] -> 200 {freet0,1,2}
*/

describe('GET/api/freet', ()=>{

  const agent = supertest.agent(app);

  let users = [];

  beforeEach(()=>{
    return createUsersWithFreets( 3, users )
    .then(( the_users )=>{
      users = the_users;
    });
  });

  // it('something', (done)=>{console.log(users);expect(1).toBe(1); done()});

  it('returns 200 when getting all freets when there 3', (done)=>{
    const 
      expected_freet_list = [
                              users[1].freet_list, 
                              users[2].freet_list
      ].flat(),
      query               =   {}
    ;

    agent.get('/api/freet').query(query).expect(200)
    .end((err,res)=>{
      if (err) return done(err); 
      expect(res.body.length).toBe(expected_freet_list.length);

      res.body.forEach(( actual_freet )=>{
        expect(
          expected_freet_list.some(( expected_freet )=>{
            return actual_freet.freet_id === expected_freet.freet_id;
          })
        ).toBeTruthy();
      })

      done();
    });
  });

  it('returns 200 and array with 2 freets when searching for freets'
        + ' by a user that has 2 freets when there are 3 freets', (done)=>{

    const 
      expected_freet_list = users[2].freet_list,
      query               = { author: users[2].credentials.name };

    agent.get('/api/freet').query(query).expect(200)
    .end((err,res)=>{
      if (err) return done(err); 
      expect(res.body.length).toBe(expected_freet_list.length);

      res.body.forEach(( actual_freet )=>{
        expect(
          expected_freet_list.some(( expected_freet )=>{
            return actual_freet.freet_id === expected_freet.freet_id;
          })
        ).toBeTruthy();
      })

      done();
    });

  });

  afterEach(()=>{

    //delete users

    const promises = [];

    users.forEach(( user )=>{

      const agent = supertest.agent(app);

      const promise = new Promise((resolve,reject)=>{
        agent
          .post('/api/session/login').send(user.credentials)
          .then(()=>{
            return agent.delete('/api/user').send();
          })
          .then(()=>{
            resolve();
          });
      });

      promises.push( promise );

    });

    return Promise.all( promises );

  });
});

//-------------------------------------------------------
//              END TESTS FOR GET/api/freet
//-------------------------------------------------------

/**
* Testing Strategy for POST/api/freet/:freet_id/vote
* 
* Partition input as follows:
*
* logged in: yes, no
* freet_id exists: yes, no
* user is author: yes, no
* direction: up, down
*
* Cover each value at least once:
*
* [not logged in, is not author, freet_id,   up] -> 401
* [    logged in,     is author, freet_id,   up] -> 403
* [    logged in, is not author, freet_id,   up] -> 204
* [    logged in, is not author, freet_id, down] -> 204
* [    logged in, is not author, wrong_id,   up] -> 404
*
* Setup:  POST/api/user
*         POST/api/session/login
*         POST/api/freet
*         ...
*         DELETE/api/user
*         DELETE/api/session/logout
*
* Observer: GET/api/freet
*/

describe('POST/api/freet/:freet_id/vote', ()=>{

  let author_agent = supertest.agent(app),
      not_author_agent = supertest.agent(app),
      ids   = {}
  ;

  beforeEach(()=>{
    return createUserLoginAndFreet( author_agent, ids )
          .then(()=>{
            return createUserAndLogin( not_author_agent, 'name2' );
          });
  });

  // it('whatever', (done)=>{
  //   expect(1).toBe(1); done();
  // });

  it('returns 401 when upvoting a freet if not logged in', (done)=>{
    const agent     = supertest(app),    //not logged in
          freet_id  = ids.freet_id
    ;


    agent
    .post('/api/freet/' + freet_id + '/vote?direction=up')
    .send()
    .expect(401)
    .end((err,res)=>{
      if (err) return done(res);
      done();
    });
  });

  it('returns 403 when upvoting a freet if author logged in', (done)=>{
    const agent     = author_agent,
          freet_id  = ids.freet_id
    ;

    agent
    .post('/api/freet/' + freet_id + '/vote?direction=up')
    .send()
    .expect(403)
    .end((err,res)=>{
      if (err) return done(res);
      done();
    });
  });

  it('returns 204 when upvoting a freet if not author logged in', (done)=>{
    const direction       = 'up',
          expected_votes  = 1,
          agent           = not_author_agent,
          freet_id        = ids.freet_id
    ;

    testFreetVoting( agent, freet_id, direction, expected_votes, done );
  });

  it('returns 204 when downvoting a freet if not author logged in', (done)=>{
    const direction       = 'down',
          expected_votes  = -1,
          agent           = not_author_agent,
          freet_id        = ids.freet_id
    ;

    testFreetVoting( agent, freet_id, direction, expected_votes, done );
  })

  it('returns 404 when upvoting a freet that does not exist', (done)=>{
    const agent     = not_author_agent,
          freet_id  = 'some random freet id'
    ;

    agent
    .post('/api/freet/' + freet_id + '/vote?direction=up')
    .send()
    .expect(404)
    .end((err,res)=>{
      if (err) return done(res);
      done();
    });
  })

  afterEach(()=>{
    return deleteUserAndLogout( author_agent )
          .then(()=>{
            return deleteUserAndLogout( not_author_agent );
          });
  });

});

//-------------------------------------------------------
//     END TESTS FOR POST/api/freet/:freet_id/upvote
//-------------------------------------------------------


//------------------------------------------------------
//                HELPER METHODS
//------------------------------------------------------

const createUserAndLogin = function ( agent, name='name' ) {
  const credentials = {
    name, 
    password: 'password'
  };

  return createUser( agent, credentials )
  .then(( user_id )=>{
    return agent
    .post('/api/session/login')
    .send(credentials)
  });
}

const createUser = function ( agent, credentials ) {
  return agent
  .post('/api/user')
  .send(credentials)
  .expect(201)
  .then(( res )=>{
    return parseId( res.headers.location );
  })
}


const createUserLoginAndFreet = function ( agent, ids ) {
  return createUserAndLogin( agent )
  .then(()=>{
    return agent
    .post('/api/freet')
    .send({message: 'a message'})
  })
  .then(( res )=>{
    ids.freet_id = parseId( res.headers.location );
  })
}

const deleteUserAndLogout = function ( agent ) {
  return agent
  .delete('/api/user')
  .send()
  .then(()=>{
    return agent
    .delete('/api/session/logout')
    .send()
  });
}

const testPostFreet = function ( agent, message, done ) {
  return agent
  .post('/api/freet')
  .send({message})
  .expect(201)
  .expect('Location', /\/api\/freet\/.+/)
  .end((err,res)=>{
    if (err) done(err);
    done();
  });
}

const testModifyFreetWithoutLoggingIn = function ( agent, method, fields, done ) {
  return supertest(app) // use a new session, that isn't logged in
  [ method ]('/api/freet')
  .send(fields)
  .expect(401)
  .end((err,res)=>{
    if (err) done(err);
    done();
  });
}

const testModifyFreetThatExists = function ( agent, method, fields, done ) {
  return agent
  [ method ]('/api/freet')
  .send(fields)
  .expect(204)
  .end((err,res)=>{
    if (err) done(err);
    done();
  });
}


const testModifyFreetNotAuthor = function ( agent, method, fields, done ) {
  const agent2 = supertest.agent(app) // log in as someone else
  const credentials = {
    name:     'someone_else',
    password: 'password'
  };

  agent2
  .post('/api/user')
  .send(credentials)
  .then(()=>{
    return agent2
    .post('/api/session/login')
    .send(credentials)
  })
  .then(()=>{
    return agent2
    [ method ]('/api/freet')
    .send(fields)
    .expect(403)
  })
  .then(()=>{
    return agent2.delete('/api/user').send();
  })
  .then(()=>{
    done();
  });
}

const testModifyNonExistingFreet = function ( agent, method, fields, done ) {
  return agent
  .delete('/api/freet')
  .send(fields)
  .expect(404)
  .end((err,res)=>{
    if (err) done(err);
    done();
  });   
}

const createMessageOfLength = function ( length ) {
  let chars = [];
  chars.length = length;
  chars.fill( 'a' );
  return chars.join( '' );
}

const parseId = function ( url ) {
  return url.substring( url.lastIndexOf('/') + 1 );
}

const createUsersWithFreets = function ( user_count ) {

  const promises = [];

  //create user_count users, with i freets each
  for (let i = 0; i != user_count; i++) {
    const promise = new Promise((resolve,reject)=>{
      const agent       =   supertest.agent(app),
            credentials = {
                            name:     'name'      + i, 
                            password: 'password'  + i
            }
      ;

      createUser( agent, credentials )
      .then(( user_id )=>{
        const user = {
                        user_id,
                        credentials,
                        freet_list: [],
                        i,
        };

        createUserFreets( user )
        .then(()=>{
          resolve( user );
        });
      })
    });
    promises.push( promise );
  };

  return new Promise((resolve,reject)=>{
    const users = [];
    Promise.all( promises )
    .then(( the_users )=>{
      the_users.forEach(( user )=>{
        users[ user.i ] = user;
      });
      resolve( users );
    });
  });

}

const createUserFreets = function( user ) {
  const promises  = [],
        i         = user.i;

  //create i user freets
  for ( let j = 0; j != i; j++ ) {

    const freet_idx   = i + j - 1,
          freet       = {
            author_id:  user.user_id,
            message:    'message'+ freet_idx
          };

    promises.push(
      createUserFreet( user, freet )
    );

  }

  return Promise.all( promises );
}

const createUserFreet = function ( user, freet ) {
  return new Promise((resolve,reject)=>{

    const agent = supertest.agent(app);

    agent
    .post('/api/session/login').send(user.credentials)
    .then(()=>{
      agent
      .post('/api/freet').send(freet)
      .end((err,res)=>{
        freet.freet_id = parseId( res.headers.location );

        //add to user's freet_list
        user.freet_list.push( freet );

        resolve();

      });
    });
  });
}

const testFreetVoting = 
  ( agent, freet_id, direction, expected_votes, done )=>{
  
    agent
    .post('/api/freet/' + freet_id + '/vote?direction=' + direction)
    .send()
    .expect(204)
    .end((err,res)=>{
      if (err) return done(res);
      agent
      .get('/api/freet/')
      .query( {freet_id} )
      .end((err,res)=>{
        if (err) return done(res);
        expect(res.body[0].votes).toBe( expected_votes );
        done();
      });
    });  
} 
