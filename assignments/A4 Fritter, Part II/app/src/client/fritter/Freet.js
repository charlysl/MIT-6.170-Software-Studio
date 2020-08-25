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

  isAuthorLoggedIn () {
    return this.props.username === this.props.freet.author;
  }

  isNonAuthorLoggedIn () {
    return this.props.username 
            && (this.props.username != this.props.freet.author);
  }

  getEditAndDeleteControls () {
    const freet     = this.props.freet,

          editUrl   = "/freet/edit/" + freet.freet_id 
                      + '?' + this.freetToQuery(),

          deleteUrl = "/freet/delete/" + freet.freet_id
    ;

    return (
          <React.Fragment>
            <Link to={editUrl}>Edit</Link>
            <Link to={deleteUrl}>Delete</Link>
          </React.Fragment>
    )
  }

  getVotingControls () {
    return (
        <React.Fragment>
          <button onClick={this.onUpvote.bind(this)}>Upvote</button>
          <button onClick={this.onDownvote.bind(this)}>Downvote</button>
        </React.Fragment>
    )
  }

  render () {
  
    const mutatorButtons =  this.isAuthorLoggedIn()       ?
                            this.getEditAndDeleteControls() :
                            null;

    const votingButtons  = this.isNonAuthorLoggedIn() ?
                           this.getVotingControls()   :
                           null;
    const freet = this.props.freet;

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
