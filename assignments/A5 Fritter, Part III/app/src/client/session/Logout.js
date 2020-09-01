import React from 'react';
import { Redirect } from 'react-router-dom';

import sessionAPI from '../api/sessionAPI';


class Logout extends React.Component {

  async componentWillMount() {
    await sessionAPI.logout();
    this.props.onLogout();
  }

  render () {
    return <Redirect to='/' />
  }

}

export default Logout;