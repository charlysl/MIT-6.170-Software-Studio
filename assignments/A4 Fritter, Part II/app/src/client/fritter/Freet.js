import React from 'react';
import {Link} from 'react-router-dom';

import freetAPI from '../api/freetAPI';


class Freet extends React.Component {

  async onUpvote () {
    const freet = this.props.freet;
    await freetAPI.upvote( freet.freet_id );
  }

  async onDownvote () {
    const freet = this.props.freet;
    await freetAPI.downvote( freet.freet_id );
  }

  freetToQuery () {
    const freet = this.props.freet;
    let pairs = [];
    for ( let property in freet ) {
      pairs.push( property + '=' + freet[property] );
    }
    return pairs.join('&');
  }

  render () {
  
    const freet = this.props.freet;

    let mutatorButtons;
    if (this.props.username === freet.author) {
      const editLink = "/editfreet";//?" + this.freetToQuery();
      mutatorButtons = (
        <React.Fragment>
          <Link to={editLink}>Edit</Link>
          <button>Delete</button>
        </React.Fragment>
      )
    }

    let votingButtons;
    if (this.props.username != freet.author) {
      votingButtons = (
        <React.Fragment>
          <button onClick={this.onUpvote.bind(this)}>Upvote</button>
          <button onClick={this.onDownvote.bind(this)}>Downvote</button>
        </React.Fragment>
      )
    }

   return (
      <div>
        <p>{freet.author}</p>
        <p>{freet.message}</p>
        <p>{freet.votes}</p>
        {mutatorButtons}
        {votingButtons}
      </div>
    )
  }
}

export default Freet;
