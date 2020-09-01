import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import './FreetVotes.css';

import freetAPI from '../api/freetAPI';



class FreetVotes extends React.Component {

  async onUpvote () {
    const freet_id = this.props.freet.freet_id;
    await freetAPI.upvote( freet_id );
    this.props.onFreetVoted( freet_id, true );
  }

  async onDownvote () {
    const freet_id = this.props.freet.freet_id;
    await freetAPI.downvote( freet_id );
    this.props.onFreetVoted( freet_id, false );
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
                                  className="FreetVotes-icon"
                                  onClick={this.onUpvote.bind(this)} />
      downvote = <FontAwesomeIcon icon={faCaretDown} 
                                  className="FreetVotes-icon"
                                  onClick={this.onDownvote.bind(this)} /> 
    }

    return (
      <div className="FreetVotes">
        {upvote}
        <span className="FreetVotes-votes">{this.props.freet.votes}</span>
        {downvote}
      </div>
    )
  }
}

export default FreetVotes;