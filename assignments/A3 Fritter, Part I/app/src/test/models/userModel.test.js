const userModel = require('../../models/userModel');


/**
* Testing strategy for modules/userModel.js
*
* Partition input as follows:
*
* name is duplicate: yes, no
* #users in store: 0, 1, 2
*
* Cover each value at least once:
*
* {} [name1, password1] -> uid1
* {user1} [name2, password2] -> uid2
* {user1} [name1, password1] -> err
* {user1, user2} [name3, password3] -> uid3
* {user1, user2} [name2, password2] -> err
*/

const name = 'name';
const password = 'password';
let user_id;

describe('models/userModel.insert', ()=>{

  test('inserts user into empty store', () => {
    return expect(userModel.insert( 'user1', 'password1' ))
      .resolves.toMatch(/.+/);
  });

  test('inserts user into store with one user', () => {
    return expect(userModel.insert( 'user2', 'password2' ))
      .resolves.toMatch(/.*/);
  });

  test('throws error when inserting user with duplicate name'
      + ' into store with one user', () => {
    return expect(userModel.insert( 'user1', 'password2' ))
      .rejects.toThrow(/DuplicateName/);
      done();
  });

  test('inserts user into store with two users', () => {
    return expect(userModel.insert( 'user3', 'password3' ))
      .resolves.toMatch(/.*/);
  });

  test('throws error when inserting user with duplicate name' 
    + ' into store with two users', () => {
    return expect(userModel.insert( 'user1', 'password1' ))
      .rejects.toThrow(/DuplicateName/);
  });

});


/**
* Testing Strategy for models/userModel.get
*
* Partition input space as follows:
*
* user with name in store: yes, no
* #users in store: 0, 1, 2
*
* Cover each value at least once:
*
* {} [name] -> err
* {user1} [name1] -> user1
* {user1} [name2] -> err
* {user1, user2} [name1] -> user1
* {user1, user2} [name3] -> err 
*
* Setup: models/userModel.insert
*/

describe('models/userModel.get', ()=>{

  test('throws error when user name is not in store', () => {
    return expect(userModel.get('no_name'))
      .rejects.toThrow(/NameNotFound/);
  });

  it('returns user when user name is in store', 
    ()=>{
      return expect(userModel.get('user1'))
        .resolves.toHaveProperty( 'name', 'user1' );
  });

});


/*
* Testing Strategy for model/userModel.edit
*
* Partition input as follows:
*
* new name: yes, no
* new password: yes, no
* duplicate name: yes, no
*
* Cover each value at least once:
*
* [user_id, new_name, old_password]
* [user_id, old_name, new_password]
* [user_id, dup_name, old_password] -> DuplicateName
* [user_id, new_name]
* [user_id, new_password]
* [user_id, dup_name] -> DuplicateName
*
* Setup: userModel.insert, userModel.remove
* Observer: userModel.get
*/ 

describe('models/userModel.edit', ()=>{

  let user_id;

  beforeEach(() => {
    return userModel.insert( name, password )
    .then(( the_user_id )=>{
      user_id = the_user_id;
    });
  });

  test('edits user with new name and old password', ()=>{
    assertEditUser({
      user_id,
      name: 'new_name',
      password
    });
  });

  test('edits user with old name and new password', ()=>{
    assertEditUser({
      user_id,
      name,
      password: 'new_password'
    });
  });

  test('throws DuplicateName when editing user with '
        + 'duplicate name and old password', 
    ()=>{
      return expect(
        userModel.insert( 'new_name', 'new_password' )
        .then(()=>{
          return userModel.edit({
            user_id,
            name: 'new_name',
            password
          })
        })
      ).rejects.toThrow( /DuplicateName/ );
  });

  test('edits user with new name', ()=>{
    return expect(
      userModel.edit({
        user_id,
        name: 'new_name'
      })
      .then(()=>{
        return userModel.get( 'new_name' )
      })
    ).resolves.toEqual({
      user_id,
      name: 'new_name',
      password
    });
  });

  test('edits user with new password', ()=>{
    return expect(
      userModel.edit({
        user_id,
        password: 'new_password'
      })
      .then(()=>{
        return userModel.get( name )
      })
    ).resolves.toEqual({
      user_id,
      name,
      password: 'new_password'
    });
  });


  test('throws DuplicateName when editing user with '
        + 'duplicate name', ()=>{
      return expect(
        userModel.insert( 'new_name', 'new_password' )
        .then(()=>{
          return userModel.edit({
            user_id,
            name: 'new_name',
          })
        })
      )
      .rejects.toThrow( /DuplicateName/ );
  });

  afterEach(()=>{
    return userModel.remove( user_id )
    .then(()=>{
      // delete the user that was created for
      // the duplicate name tests 
      return userModel.get( 'new_name' );
    })
    .then(( user )=>{
      return userModel.remove( user.user_id );
    })
    .catch((ex) => {
      // OK, expect UserNotFound after some tests
    });
  });

});

/*
* Testing Strategy for models/userModel.remove
*
* Partition input as follows:
*
* user_id exists: yes
*
* Observer: models/userModel.get
*/

describe('models/userModel.remove', ()=>{

  beforeEach(()=>{
    return userModel.insert( name, password )
    .then(( the_user_id ) => {
      user_id = the_user_id;
    });
  });

  test('removes user', () => {
    expect(userModel.remove( user_id )
    .then(()=>{
      return userModel.get( name );
    }))
    .rejects.toThrow(/NameNotFound/);
  });

});


const assertEditUser = function ( user ) {
  return expect(userModel.edit( user )
  .then(()=>{
    return userModel.get( user.name );
  })).resolves.toEqual( user );
}

