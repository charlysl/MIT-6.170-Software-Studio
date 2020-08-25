import axios from 'axios';

/**
* Request Fritter server to create a new user.
* @param {string} fields.name     - the user's name
* @param {string} fields.password - the user's password
* @throws {DuplicateUser} - if there already exists a user with the given name
*/
async function create ( fields ) {
  try {
    await axios.post( '/api/user', fields );
  } catch (err) {
    handleError(err);
  }
}


/**
* Request Fritter server to delete the current user.
*/
async function remove () {
  try {
    await axios.delete( '/api/user' );
  } catch (err) {
    handleError(err);
  }
}

/**
* Request Fritter server to edit a user.
* @param {string} fields.name     (optional) - the user's name 
* @param {string} fields.password (optional) - the user's password
* @throws {DuplicateUser} - if there already exists a user with the given name
*/
async function edit ( fields ) {
  try {
    await axios.put( '/api/user', fields );
  } catch (err) {
    handleError(err);
  }
}

function handleError (err) {
  switch (err.response.status) {
    case 403:
      throw new Error('DuplicateUser');
    default:
      throw new Error('Caught unexpected exception: ' + err.response);
  }
}

export default { create, remove, edit };

