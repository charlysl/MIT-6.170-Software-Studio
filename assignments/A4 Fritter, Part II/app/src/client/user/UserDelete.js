import React from 'react';
import { Redirect } from 'react-router-dom';

import userAPI from '../api/userAPI';


/**
* User deletion React Component.
*
* This component does not display anything.
* Requests the server to delete the user and logs the user out.
*
*/
class UserDelete extends React.Component {
  async componentWillMount () {
    await userAPI.remove();
  }

  render () {
    return <Redirect to='/session/logout' />
  }

}

export default UserDelete;
