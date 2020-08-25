import React from 'react';

import Navigation from './navigation/Navigation';
import FreetSearch from './fritter/FreetSearch';
import NewFreetDialog from './fritter/NewFreetDialog';
import Freets from './fritter/Freets';
import Logout from './session/Logout';
import EditFreetDialog from './fritter/EditFreetDialog';


class Home extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      freets: [],
    };

  }

  onFreets ( freets ) {
    this.setState( {freets} );
  }


  render () {

        // <main>
        //   <NewFreetDialog />
        // </main>

    return (
      <React.Fragment>
        <nav><Navigation username={this.props.username}/></nav>
        <header>
          <FreetSearch onFreets={this.onFreets.bind(this)} />
          <Freets freets={this.state.freets} username={this.props.username}/>
        </header>
      </React.Fragment>
    )  
  }
}

export default Home;
