import React from 'react';
import Redirect from 'react-router-dom';

import userAPI from '../api/userAPI';

import CredentialsDialog from '../common/CredentialsDialog'

/**
* Create a new user React Component.
* @param {Function} onApply
* 
*
*/
const UserCreate = function (props) {

  const onApply = async function ( fields ) {
    try {
      await userAPI.create( fields );
      return ({
        error: '',
        redirect: '/user/done-create'
      });
    } catch (err) {
      if (err.message.match(/DuplicateUser/)) {
        return ({
          name:   '',
          error:  'Choose a different name'
        });
      } else {
        throw err;
      }
    }
  }

  return (
    <CredentialsDialog  apply     = "Sign Up" 
                        onApply   = {onApply} />
  )
}

export default UserCreate;
