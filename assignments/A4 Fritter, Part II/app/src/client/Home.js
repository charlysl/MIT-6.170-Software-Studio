import React from 'react';

import FreetSearch from './fritter/FreetSearch';
import Freets from './fritter/Freets';

import FreetCreateStart from './fritter/FreetCreateStart';


class Home extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      freets: [],
      sortedFreets: [],
      isSorted: false,
    };

  }

  onFreets ( freets ) {
    this.setState(( state ) => {
      state.freets = freets;
      state.sortedFreets = Array.from( state.freets );
      state.sortedFreets.sort(( freet1, freet2 ) => {
        return freet1.votes < freet2.votes;
      });
      return state;
    });
  }

  onSorted ( event ) {
    console.log('Home.onSorted', event);

    const isSorted = event.target.checked;

    this.setState({ isSorted });
  }


  render () {
    console.log('Home', this.state);

    const freetCreateStart = this.props.username ? <FreetCreateStart /> : null;

    return (
      <React.Fragment>
        <header>
          <FreetSearch  isSorted={this.state.isSorted}
                        onFreets={this.onFreets.bind(this)} 
                        onSorted={this.onSorted.bind(this)}/>
        </header>
        <main>
          <Freets freets={this.state.isSorted ? 
                          this.state.sortedFreets   : 
                          this.state.freets} 
                  username={this.props.username}/>
          {freetCreateStart}
        </main>
      </React.Fragment>
    )  
  }
}

export default Home;
