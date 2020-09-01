/**
* test/models/freetModel.js
*
* Tests for models/freetModel.js
*/

// const freetModel = require('../../models/freetModel');
const freetModel = require('../../models/postgresql/freetModel');

// const userModel = require('../../models/userModel');
const userModel = require('../../models/postgresql/userModel');

/**
* Testing Strategy for freetModel.insert
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
* Setup:  models/userModel.insert
*         models/userModel.remove
* Observers:  models/freetModel.get
*/

describe('models/freetModel.insert', ()=>{

  let author_id;

  beforeEach(()=>{
    return userModel.insert( 'name', 'password' )
    .then(( user_id )=>{
      author_id = user_id;
    })
  });

  it('returns a freet id when creating a freet with a message of length 0', ()=>{
    testInsertFreet( author_id, '' );
  });

  it('returns a freet id when creating a freet with a message of 0 < length < 140', ()=>{
    const message = 'a message';
    testInsertFreet( author_id, message );
  });

  it('returns a freet id when creating a freet with a message of length 140', ()=>{
    const message = createMessageOfLength( 140 );
    testInsertFreet( author_id, message );
  });

  it('it throws MessageTooLong when creating a freet with a message of length > 140', ()=>{
    const message = createMessageOfLength( 141 );
    expect(
      freetModel.insert({
        author_id,
        message,
        votes: 0
      })
    ).rejects.toThrow( /MessageTooLong/ );
  });


  afterEach(()=>{
    return userModel.remove( author_id )
  });

});

/**
* Testing Strategy for freetModel.delete
*
* Partition input as follows:
*
* freet_id exists: yes, no
*
* Cover each value at least once:
*
* [freet_id does not exist] -> FreetNotFound
* [freet_id exists]         ->
*
* Setup:  userModel.insert
*         freetModel.insert
*         ...
*         userModel.remove
* Observers: freetModel.delete
*/

describe('models/freetModel.delete', ()=> {

  let ids = {};

  beforeEach(()=>{
    return createUserAndFreet( ids );
  });

  test('throws FreetNotFound when deleting freet with non-existing freet_id', 
    ()=>{
      expect(
        freetModel.delete( 'some random freet id' )
      ).rejects.toThrow( /FreetNotFound/ );
  });

  test('deletes freet with existing freet_id', ()=>{
    expect(
      freetModel.delete( ids.freet_id )
    ).resolves.toBeUndefined();

    expect(
      freetModel.delete( ids.freet_id )
    ).rejects.toThrow( /FreetNotFound/ );
  });

  afterEach(()=>{
    return userModel.remove( ids.user_id )
  });
});

//----------------------------------------------------
//                END OF TESTS FOR DELETE
//----------------------------------------------------

/**
* Testing Strategy for freetModel.edit
*
* Partition input as follows:
*
* message length: 0, 0 < 140, 140, >140
* votes: -1, 0, 1
* change property: message, votes, both
*
* Cover each value at least once:
*
* [''               ,  1]  -> 
* ['my message'     , no]  -> 
* [no message       , -1]  -> 
* [140 char message ,  0]  -> 
* [141 char message ,  0]  -> MessageTooLong
*
* Cover all values at least once:
*

* Setup:  userModel.insert
*         freetModel.insert
*         ...
*         userModel.remove
* Observers: freetModel.get
*/

describe('models/freetModel.edit', ()=> {

  let ids = {};

  beforeEach(()=>{
    return createUserAndFreet( ids );
  });

  test('edits a freet with a message of length 0 and 1 vote', ()=>{
    const freet = {
      freet_id:   ids.freet_id,
      author_id:  ids.user_id,
      message:    '',
      votes:      1
    }

    const expected_freet = {};
    Object.assign( expected_freet, freet );

    testEditFreet( freet, expected_freet );
  });

  test('edits a freet' 
        + ' with a message of 0 < length < 140 and no votes', ()=>{
    const freet = {
      freet_id:   ids.freet_id,
      author_id:  ids.user_id,
      message:    'a different message'
    }

    const expected_freet = {};
    Object.assign( expected_freet, freet );
    expected_freet.votes = 0;

    testEditFreet( freet, expected_freet );
        testEditFreet( freet, expected_freet );
  });

  test('edits a freet' 
        + ' with a message of length 140 and 0 votes', ()=>{
    const message = createMessageOfLength( 140 );

    const freet = {
      freet_id:   ids.freet_id,
      author_id:  ids.user_id,
      message:    message,
      votes:      0
    }

    const expected_freet = {};
    Object.assign( expected_freet, freet );

    testEditFreet( freet, expected_freet );
  });

  test('throws MessageTooLong when editing a freet' 
        + ' with a message of length > 140', ()=>{
    const message = createMessageOfLength( 141 );

    const freet = {
      freet_id:   ids.freet_id,
      author_id:  ids.user_id,
      message:    message,
      votes:      2
    }

    expect(
      freetModel.edit( freet )
    ).rejects.toThrow( /MessageTooLong/ );
  });

  afterEach(()=>{
    return userModel.remove( ids.user_id )
  });
});

//----------------------------------------------------
//                END OF TESTS FOR EDIT
//----------------------------------------------------

/**
* Testing Strategy for freetModel.get
*
* Partition input as follows:
*
* freet_id exists: yes, no
*
* Cover each value at least once:
*
* [freet_id does not exist] -> FreetNotFound
* [freet_id exists]         ->
*
* Setup:  userModel.insert
*         freetModel.insert
*         ...
*         userModel.remove
*/

describe('models/freetModel.get', ()=>{
  let ids = {};

  beforeEach(()=>{
    return createUserAndFreet( ids );
  });

  test('throws FreetNotFound when getting freet with non-existing freet_id', 
    ()=>{
      expect(
        freetModel.get( 'some random freet id' )
      ).rejects.toThrow( /FreetNotFound/ );
  });

  test('gets freet with existing freet_id', ()=>{
    expect(
      freetModel.get( ids.freet_id )
    ).resolves.toMatchObject( {
      freet_id: ids.freet_id,
      author_id: ids.user_id
    });
  });

  afterEach(()=>{
    return userModel.remove( ids.user_id )
  });

});

//----------------------------------------------------
//                END OF TESTS FOR GET
//----------------------------------------------------

/**
* Testing Strategy for freetModel.search
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

describe('models/freetModel.search', ()=>{

  let user_map = new Map(),
      one_freet_list,
      three_freet_list
  ;

  beforeEach(()=>{
    const promises = [];
    [0,1,2].forEach(( i )=>{
      const name = 'name' + i;
      promises.push(
        userModel.insert( name, 'password'+i )
        .then(( user_id )=>{

          user_map.set( name, user_id );

          one_freet_list = [
                              {
                                author_id: user_map.get('name1'), 
                                message: 'message0', 
                                votes: 0
                              }
          ];
          three_freet_list =[
                              {
                                author_id: user_map.get('name1'), 
                                message: 'message0', 
                                votes: 0
                              },
                              {
                                author_id: user_map.get('name2'), 
                                message: 'message1', 
                                votes: 0
                              },
                              {
                                author_id: user_map.get('name2'), 
                                message: 'message2', 
                                votes: 0
                              }
          ];
        })
      );
    });
    Promise.all( promises )
    .then((the_user_ids)=>{
      user_ids=the_user_ids
    });
  });

  test('return empty array when searching for all freets' 
        + ' when there are none', 
    ()=>{
      expect(
        freetModel.search()
      .then(( freets )=>{
        return freets.length;
      })
      ).resolves.toBe(0);
    }
  );

  test('return empty array when searching for freets by author' 
        + ' when there are none', 
    ()=>{
      expect(
        freetModel.search({author: 'name0'})
      .then(( freets )=>{
        return freets.length;
      })
      ).resolves.toBe(0);
    }
  );

  test('return array with one freet when searching for all freets'
        + ' when there is one freet', ()=>{

    const 
      freet_list = [
        {author_id: user_map.get('name1'), message: 'message1', votes: 0}
      ],
      expected_freet_list = Array.of( freet_list[0] );

    return testSearchFreet( freet_list, expected_freet_list );

  });

  test('return array with one freet when searching for freets by author'
        + ' when there is one freet, which is by said author', ()=>{

    const 
      freet_list          = one_freet_list,
      expected_freet_list = Array.of( freet_list[0] ),
      query               = { author_id: user_map.get('name1') };

    return testSearchFreet( freet_list, expected_freet_list, query );

  });
  
  test('return empty array when searching for freets by author'
        + ' when there is one freet, which is by another author', ()=>{

    const 
      freet_list      = one_freet_list,
      expected_freet_list = [],
      query               = { author_id: user_map.get('name2') };

    return testSearchFreet( freet_list, expected_freet_list, query );

  });

  test('return array with 3 freets when searching for all freets', ()=>{

    const 
      freet_list          = three_freet_list,
      expected_freet_list = Array.from( freet_list ),
      query               = {};

    return testSearchFreet( freet_list, expected_freet_list, query );

  });

  test('return empty array when searching for freets'
        + ' by a user that has no freets when there are 3 freets', ()=>{

    const 
      freet_list          = three_freet_list,
      expected_freet_list = [],
      query               = { author_id: user_map.get('name0') };

    return testSearchFreet( freet_list, expected_freet_list, query );

  });

  test('return array with 1 freet when searching for freets'
        + ' by a user that has 1 freet when there are 3 freets', ()=>{

    const 
      freet_list          = three_freet_list,
      expected_freet_list = Array.of( freet_list[0] ),
      query               = { author_id: user_map.get('name1')  };

    return testSearchFreet( freet_list, expected_freet_list, query );

  });

  test('return array with 2 freets when searching for freets'
        + ' by a user that has 2 freets when there are 3 freets', ()=>{

    const 
      freet_list          = three_freet_list,
      expected_freet_list = Array.of( freet_list[1], freet_list[2] ),
      query               = { author_id: user_map.get('name2')  };

    return testSearchFreet( freet_list, expected_freet_list, query );

  });


  afterEach(()=>{
    const promises = [],
          user_ids = Array.from(user_map.values())
    ;
    user_ids.forEach(( user_id )=>{
      promises.push(
        userModel.remove( user_id )
      )
    });
    return Promise.all( promises )
    .then(()=>{
        deleteAllFreets();
    });
  });

});

//----------------------------------------------------
//                END OF TESTS FOR SEARCH
//----------------------------------------------------

//---------------------------------------------------------
//                    END OF TESTS
//---------------------------------------------------------

//---------------------------------------------------------
//                    START HELPERS
//---------------------------------------------------------


const testInsertFreet = function ( author_id, message ) {
  expect(
    freetModel.insert({
      author_id, 
      message,
      votes: 0
    })
  ).resolves.toMatch( /.+/ );
}

const testEditFreet = function ( freet, expected_freet ) {
  expect(
    freetModel.edit( freet )
    .then(()=>{
      return freetModel.get( freet.freet_id )
    })
  ).resolves.toEqual( expected_freet );
}

const testSearchFreet = 
 function ( freet_list, expected_freet_list, query={} ) {
  const promises = [];
  freet_list.forEach(( freet )=>{
    promises.push(
      freetModel.insert( freet )
    )
  });
  return Promise.all(promises)
  .then(()=>{
    return freetModel.search( query );
  })
  .then(( actual_freet_list )=>{
    const actual_length   =   actual_freet_list.length;
    const expected_length = expected_freet_list.length;
    expect(actual_length).toBe(expected_length);

    // expect each expected freet to be in the actual freet list
    expected_freet_list.forEach(( expected_freet )=>{
      expect(
        actual_freet_list.some(( actual_freet )=>{
          return actual_freet.author_id === expected_freet.author_id
              && actual_freet.message   === expected_freet.message;
        })
      );
    });

    deleteAllFreets();

  });
}

const deleteAllFreets = function () {
  const promises = [];
  freetModel.search()
  .then(( freet_list )=>{
    freet_list.forEach(( freet )=>{
      promises.push(
        freetModel.delete( freet.freet_id )
      )
    });
    return Promise.all( promises )
    .then(()=>{
      const freets_left = freetModel.search();
      if (freets_left.length > 0) {
        throw new Error('There are still ' + freets_left.length 
                        + ' undeleted freets'); //assertion
        console.log(freets_left);
      }
    });
  });
}



const createMessageOfLength = function ( length ) {
  const chars = [];
  chars.length = length;
  chars.fill( 'a' );
  return chars.join( '' );
}

const createUserAndFreet = function ( ids ) {
  return userModel.insert( 'name', 'password' )
  .then(( user_id )=>{
    ids.user_id = user_id;
    return freetModel.insert( {
      author_id : user_id,
      message   : 'a message',
      votes     : 0
    })
  })
  .then(( freet_id )=>{
    ids.freet_id = freet_id;
  });
}

const findUserId = function ( name, userList ) {
  return userList.find(( user ) => {
    if ( user.credentials.name === name ) {
      return user.user_id;
    }
  });
}
