import React from 'react';
import {Link} from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


import './Freet.css';

import freetAPI from '../api/freetAPI';

import FreetVotes from './FreetVotes';


class Freet extends React.Component {

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


  getEditAndDeleteControls () {
    const freet     = this.props.freet,

          editUrl   = "/freet/edit/" + freet.freet_id 
                      + '?' + this.freetToQuery(),

          deleteUrl = "/freet/delete/" + freet.freet_id
    ;

    return (
          <React.Fragment>
            <Link to={editUrl}>
              <FontAwesomeIcon icon={faEdit} />
            </Link>
            <Link to={deleteUrl}>
              <FontAwesomeIcon icon={faTimes} />
            </Link>
          </React.Fragment>
    )
  }

  render () {
  
    const mutators =  this.isAuthorLoggedIn()       ?
                            this.getEditAndDeleteControls() :
                            null;


    const freet = this.props.freet;

    return (
      <div className="Freet">
        <div className="Freet-other">
          <p>{freet.author}</p>
        </div>
        <div>
          <p className="Freet-message">{freet.message}</p>
          <div className="Freet-controls">
            <FreetVotes freet={this.props.freet} username={this.props.username} />
            {mutators}
          </div>
        </div>
      </div>
    )
  }
}

export default Freet;
