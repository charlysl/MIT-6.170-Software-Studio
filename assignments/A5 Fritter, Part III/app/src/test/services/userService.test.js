const userService = require('../../services/userService');

/**
* Testing strategy for userService.create
*
* Partition input space as follows:
* 
* name is unique: yes, no
*/

const name = 'name';
const password = 'password';
let user_id;

describe('services/userService.create', () => {

  let user_id;

  test('creates a user', ()=>{
    return expect(
        userService.create( name, password )
        .then(( the_user_id )=>{
          user_id = the_user_id;
          return user_id;
        })
      ).resolves.toMatch(/.+/);
  });

  test ('throws an exception if name is duplicate', ()=>{
    return expect(userService.create( name, password ))
      .rejects.toThrow(/DuplicateName/);
  });

  afterAll(()=>{
    return userService.remove( user_id );
  });

});


/**
* Testing strategy for userService.edit
*
* Partition input as follows:
*
* name is given: yes, no
* password is given: yes, no
* name is duplicate: yes, no
* name is changed: yes, no
* password is changed: yes, no
*
* Cover each value at least once:
*
* [user_id, new_name, old_password]
* [user_id, old_name, new_password]
* [user_id, dup_name, old_password]
* [user_id, old_name]
* [user_id, old_password]
* [user_id, new_name]
* [user_id, new_password]
* [user_id, dup_name]
*
* Setup: userService.create, userService.remove
* Observer: userService.authenticate
*/

describe('services/userService.edit', () => {

  let user_id;
  let new_user_id;

  beforeEach(()=>{
    // create a user to be edited and to set user_id
    return userService.create( name, password )
    .then(( the_user_id )=>{
      user_id = the_user_id;
    });
  });

  test('changes name, keeps old password', () => { 
    const user = {
      user_id,
      name: 'new_name',
      password
    };

    return expect(
      userService.edit( user )
      .then(()=>{
        return userService
                .authenticate( 'new_name', password );
      })
    ).resolves.toBe( user_id );
  });

  test('changes password, keeps old name', () => {
    const user = {
      user_id,
      name,
      password: 'new_password'
    };

    return expect(
      userService.edit( user )
      .then(()=>{
        return userService
                .authenticate( name, 'new_password' );
      })
    ).resolves.toBe( user_id );
  });

  test('throws exception when changing to duplicate name, '
        + 'with a password', 
    () => {
      return expect(
        userService.create( 'new_name', 'new_password' )
        .then(( the_user_id )=>{
          new_user_id = the_user_id;
          return userService.edit({
            user_id,
            name: 'new_name',
            password
          })
        })
      ).rejects.toThrow( /DuplicateName/ )
  });

  test('keeps old name', () => {
    const user = {
      user_id,
      name
    };

    return expect(
      userService.edit( user )
      .then(()=>{
        return userService
                .authenticate( name, password );
      })
    ).resolves.toBe( user_id );
  });

  test('keeps old password', () => {
    const user = {
      user_id,
      password
    };

    return expect(
      userService.edit( user )
      .then(()=>{
        return userService
                .authenticate( name, password);
      })
    ).resolves.toBe( user_id );
  });

  test('changes name',  () => {
    const user = {
      user_id,
      name: 'new_name',
    };

    return expect(
      userService.edit( user )
      .then(()=>{
        return userService
                .authenticate( 'new_name', password);
      })
    ).resolves.toBe( user_id );
  });

  test('changes password', () => {
    const user = {
      user_id,
      name,
      password: 'new_password'
    };

    return expect(
      userService.edit( user )
      .then(()=>{
        return userService
                .authenticate( name, 'new_password' );
      })
    ).resolves.toBe( user_id );
  });

  test('throws exception when changing to duplicate name', 
    ()=> {
      return expect(
        userService.create( 'new_name', 'new_password' )
        .then(( the_user_id )=>{
          new_user_id = the_user_id;
          return userService.edit({
            user_id,
            name: 'new_name',
          })
        })
      ).rejects.toThrow( /DuplicateName/ )
  });

  afterEach(()=>{
    // remove the user with user_id
    return userService.remove( user_id )
    .then(()=>{
      // remove the new_name user that was created 
      // by some tests
      if ( new_user_id ) {
        const promise = userService.remove( new_user_id );
        new_user_id = undefined;
        return promise;
      }
    })
  });

});

/**
* Testing Strategy for userService.remove
* 
* Partition input as follows:
*
* user_id exists: yes
*/

describe('services/userService.remove', ()=>{

  let user_id;

  beforeEach(()=>{
    // must return the Promise, so that Jest
    // can wait for it to resolve
    return userService.create( name, password )
    .then(( the_user_id ) => {
      user_id = the_user_id;
    });
  });

  test('removes a user', ()=>{
    return userService.remove( user_id )
    .then(()=>{
      return userService.create( name, password);
    })
    .then(( the_user_id )=> {
      user_id = the_user_id;
    });
  });

  afterEach(()=>{
    return userService.remove( user_id );
  });

});

/**
* Testing strategy for userService.authenticate
* 
* Partition input as follows:
*
* name is valid: yes, no
* password is valid: yes, no
*
* Cover each input value at least once:
*
* [valid_name, valid_password] => user_id
* [invalid_name, valid_password] => exception
* [valid_name, invalid_password] => exception
*/

describe('services/userService.authenticate', () => {

  let user_id;

  beforeAll(()=>{
    userService.create( name, password )
    .then(( the_user_id )=>{
      user_id = the_user_id;
    })
  });

  test('returns user id if credentials are valid', () => {
    return expect(userService.authenticate( name, password ))
      .resolves.toMatch( /.+/ );
  });

  test('throws an exception if name is invalid', () => {
    return expect(userService.authenticate( 'no' , password ))
      .rejects.toThrow( /InvalidCredentials/ );
  });

  test('throws an exception if password is invalid', () => {
    return expect(userService.authenticate( name , 'no' ))
      .rejects.toThrow( /InvalidCredentials/ );
  });

  afterAll(()=>{
    userService.remove( user_id );
  })

});
