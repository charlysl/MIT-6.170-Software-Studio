import React from 'react';

import FreetSearch from './fritter/FreetSearch';
import Freets from './fritter/Freets';

import LoggedOutMenu from './navigation/LoggedOutMenu';
import FreetCreateStart from './fritter/FreetCreateStart';


class Home extends React.Component {


  render () {
    console.log('Home', this.state);

    const freetCreateStart = this.props.username ? <FreetCreateStart /> : null;
    const loggedOutMenu = this.props.username ? null : <LoggedOutMenu />;

    return (
      <React.Fragment>
        <header>
          <FreetSearch  isSorted={this.props.isSorted}
                        onFreets={this.props.onFreets}
                        onSorted={this.props.onSorted} />
          {loggedOutMenu}
        </header>
        <main>
          <Freets freets={this.props.freets} 
                  username={this.props.username}/>
          {freetCreateStart}
        </main>
      </React.Fragment>
    )  
  }
}

export default Home;
