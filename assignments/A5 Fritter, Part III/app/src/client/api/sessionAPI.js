import axios from 'axios';

/**
* Request Fritter server to login a user.
* @param {string} fields.name     - the user's name
* @param {string} fields.password - the user's password
* @throws {InvalidCredentials} - if the name and/or the password are invalid
*/
const login = async function ( fields ) {
  try {
    await axios.post( '/api/session/login', fields );
  } catch (err) {
    switch (err.response.status) {
      case 403:
        throw new Error('InvalidCredentials');
      default:
        throw new Error('Caught unexpected exception: ' + err.response);
    }
  }
}

/**
* Request fritter server to logout a user
*/
const logout = async function () {
  try {
    await axios.delete('/api/session/logout');
  } catch (err) {
    throw new Error('Caught unexpected exception: ' + err.response);
  }
}

export default { login, logout };
