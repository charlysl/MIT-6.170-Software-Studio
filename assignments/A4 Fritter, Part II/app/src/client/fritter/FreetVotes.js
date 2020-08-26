import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import './FreetVotes.css';

import freetAPI from '../api/freetAPI';



class FreetVotes extends React.Component {

  async onUpvote () {
    const freet = this.props.freet;
    await freetAPI.upvote( freet.freet_id );
  }

  async onDownvote () {
    const freet = this.props.freet;
    await freetAPI.downvote( freet.freet_id );
  }

  isNonAuthorLoggedIn () {
    return this.props.username 
            && (this.props.username != this.props.freet.author);
  }

  render () {

    let upvote = null;
    let downvote = null;

    if (this.isNonAuthorLoggedIn()) {
      upvote   = <FontAwesomeIcon icon={faCaretUp} 
                                  onClick={this.onUpvote.bind(this)} />
      downvote = <FontAwesomeIcon icon={faCaretDown} 
                                  onClick={this.onDownvote.bind(this)} /> 
    }

    return (
      <div className="FreetVotes">
        {upvote}
        <p>{this.props.freet.votes}</p>
        {downvote}
      </div>
    )
  }
}

export default FreetVotes;