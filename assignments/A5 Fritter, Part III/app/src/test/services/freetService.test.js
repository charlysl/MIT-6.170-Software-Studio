const uuid = require('uuid');

const freetService = require('../../services/freetService');
const userService = require('../../services/userService');

/**
* test/services/freetServices.test.js
*
* Tests for freetServices
*/

/**
* Testing Strategy for freetServices.create
*
* Partition input as follows:
*
* message length: 0, 0 < 140, 140, >140
*
* Cover all values at least once:
*
* ['']                -> freet_id
* ['my message']      -> freet_id
* [140 char message]  -> freet_id
* [141 char message]  -> MessageTooLong
*
* Setup:  services/userService.create
*         services/userService.remove
* Observers:  services/freetService.get
*/

describe('services/freetService.create', ()=>{

  let user_id;

  beforeEach(()=>{
    return userService.create( 'name', 'password' )
    .then(( the_user_id )=>{
      user_id = the_user_id;
    })
  });

  it('returns a freet id when creating a freet with a message of length 0', ()=>{
    return expect(
      freetService.create( user_id, '' )
    ).resolves.toMatch( /.+/ );
  });
/*
  it('returns a freet id when creating a freet with a message of 0 < length < 140', ()=>{

  });

  it('returns a freet id when creating a freet with a message of length 140', ()=>{

  });

  it('it throws MessageTooLong when creating a freet with a message of length > 140', ()=>{

  });
*/

  afterEach(()=>{
    return userService.remove( user_id );
  });

});

//--------------------------------------------------------
//            END OF TESTS FOR CREATE
//--------------------------------------------------------


/**
* Testing Strategy for freetService.delete
*
* Partition input as follows:
*
* user is the author  : yes, no
* freet id exists     : yes, no
*
* Cover each value at least once:
*
* is author,     [freet_id exists]         -> 
* is not author, [freet_id exists]         -> NotAuthorized
* is author,     [freet_id does not exist] -> FreetNotFound
*
* Setup:  userService.create
*         freetService.create
*         ...
*         userService.delete
* Observer: freetService.delete
*/

describe('services/freetService.delete', ()=>{

  let ids = {};

  beforeEach(()=>{
    return createUserAndFreet( ids );
  });

  test('deletes freet whose author is the user', ()=>{
    return expect(
      freetService.delete( ids.user_id, ids.freet_id )
    ).resolves.toBeUndefined();
  })

  test('throws NotAuthorized when deleting freet whose author is not  the user', 
    ()=>{
      const some_random_user_id = uuid.v4();
    
      return expect(
        freetService.delete( some_random_user_id, ids.freet_id )
      ).rejects.toThrow( 'NotAuthorized' );
  });

  test('throws FreetNotFound when deleting non existing freet', ()=>{
      const some_random_freet_id = uuid.v4();
    
      return expect(
        freetService.delete( ids.user_id, some_random_freet_id )
      ).rejects.toThrow( 'FreetNotFound' );
  })

  afterEach(()=>{
    return userService
    .remove( ids.user_id );
  })

});

//--------------------------------------------------------
//            END OF TESTS FOR DELETE
//--------------------------------------------------------


/**
* Testing Strategy for freetService.edit
*
* Partition input as follows:
*
* user is the author  : yes, no
* freet id exists     : yes, no
*
* Cover each value at least once:
*
* is author,     [freet_id, ''              ]   -> freet_id
* is author,     [freet_id, 'my message'    ]   -> freet_id
* is author,     [freet_id, 140 char message]   -> freet_id
* is author,     [freet_id, 141 char message]   -> MessageTooLong
* is not author, [freet_id, 'a message'     ]   -> NotAuthorized
* is author,     [wrong_id, 'a message'     ]   -> FreetNotFound
*
* Setup:  userService.create
*         freetService.create
*         ...
*         userService.delete
* Observer: freetService.get
*/

describe('services/freetService.edit', ()=>{

  let ids = {};
  let freet;

  beforeEach(()=>{
    return createUserAndFreet( ids )
    .then(()=>{
      freet = {
        freet_id:   ids.freet_id,
        message:    'a_message'
      };
    });
  });

  test('edits freet whose author is the user', ()=>{
    return expect(
      freetService.edit( ids.user_id, freet )
    ).resolves.toBeUndefined();
  });

  test('throws NotAuthorized when editing a freet' 
        + ' whose author is not the user', 
    ()=>{
    return expect(
      freetService.edit( uuid.v4(), freet )
    ).rejects.toThrow( 'NotAuthorized' );
  });

  test('throws FreetNotFound when editing non existing freet', ()=>{
    const bad_freet = Object.assign( freet );
    bad_freet.freet_id = uuid.v4();

    return expect(
      freetService.delete( freet )
    ).rejects.toThrow( 'FreetNotFound' );
  })

  afterEach(()=>{
    return userService
    .remove( ids.user_id );
  })

});

//--------------------------------------------------------
//            END OF TESTS FOR EDIT
//--------------------------------------------------------

/**
* Testing Strategy for freetService.get
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
* [{name0,1,2}, {},           {}              ] -> [] 
* [{name0,1,2}, {},           {author: name0} ] -> []
* [{name0,1,2}, {freet0},     {}              ] -> {freet0}
* [{name0,1,2}, {freet0},     {author: name1} ] -> {freet#0}
* [{name0,1,2}, {freet0},     {author: name2} ] -> []
* [{name0,1,2}, {freet0,1,2}, {}              ] -> {freet0,1,2}
* [{name0,1,2}, {freet0,1,2}, {author: name0} ] -> []
* [{name0,1,2}, {freet0,1,2}, {author: name1} ] -> {freet#0}
* [{name0,1,2}, {freet0,1,2}, {author: name2} ] -> {freet0,1,2}
*/

describe('services/freetService.search', ()=>{

  let users;

  beforeEach(()=>{

    let promises = [];

    [0, 1, 2].forEach(( i )=>{

      const credentials = {
        name:     'name'     + i,
        password: 'password' + i
      }

      const promise = 
        userService.create( credentials.name, credentials.password )
        .then(( user_id ) => {
          return {
            user_id,
            credentials
          };
        });

      promises.push( promise );

    });

    return Promise.all( promises )
    .then(( the_users ) => {
      users = the_users;
    });

  });

  test('returns empty array when getting all freets when there are none', 
    ()=>{
      return expect(
        freetService.search()
        .then(( freets )=>{
          return freets.length;
        })
      ).resolves.toBe(0);
  });

  afterEach(()=>{
    const promises = [];
    users.forEach(( user )=>{
      promises.push(
        userService.remove( user.user_id )
      );
    });
    Promise.all( promises );
  });

});

//--------------------------------------------------------
//            END OF TESTS FOR GET
//--------------------------------------------------------


//--------------------------------------------------------
//             START PRIVATE FUNCTIONS 
//--------------------------------------------------------
const createUserAndFreet = function ( ids ) {
  return userService.create( 'name', 'password' )
  .then(( user_id )=>{
    ids.user_id = user_id;
    return freetService.create( ids.user_id, 'a message' )
  })
  .then(( freet_id )=>{
    ids.freet_id = freet_id;
  });  
}
