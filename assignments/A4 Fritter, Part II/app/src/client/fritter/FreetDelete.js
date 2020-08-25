import React from 'react';
import { Redirect } from 'react-router-dom';

import freetAPI from '../api/freetAPI';

class FreetDelete extends React.Component {

  async componentWillMount () {
    const freet_id = this.props.match.params.freet_id;

    console.log('FreetDelete', this.props, freet_id);

    await freetAPI.remove( {freet_id} );
  }

  render () {
    return <Redirect to='/' />
  }
}

export default FreetDelete;