import React from 'react';

import sessionAPI from '../api/sessionAPI';

import CredentialsDialog from '../common/CredentialsDialog.js'

const Login = function (props) {

  const onApply = async function ( fields ) {
    try {
      await sessionAPI.login( fields );
      props.onLogin( fields.name );
      return {
        error: '',
        redirect: '/'
      };
    } catch (err) {
      if (err.message.match(/InvalidCredentials/)) {
        return {
          name:   '',
          password: '',
          error:  'Invalid name and/or password'
        };
      } else {
        throw err;
      }
    }
  }

  return (
    <CredentialsDialog  apply     = "Sign In" 
                        onApply   = {onApply} />
  )
}

export default Login;
