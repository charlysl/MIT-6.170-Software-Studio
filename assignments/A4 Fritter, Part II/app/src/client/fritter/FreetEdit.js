import React from 'react';
import { Link } from 'react-router-dom';

import freetAPI from '../api/freetAPI';

import MessageInput from '../fritter/MessageInput';


class FreetEdit extends React.Component {

  constructor( props ) {
    super(props);


    this.freet_id = this.props.match.params.freet_id;

    this.state = {
      message:  this.getMessage()
    };

    console.log('FreetEdit', props, this.freet_id, this.state.message);

  }

  /**
  * Extracts the message from the url
  */
  getMessage () {
    const search = this.props.location.search;
    return search.match(/message=([^&]+)/)[1];
  }

  async onClick () {
    const freet_id  = this.freet_id,
          message   = this.state.message
    ;

    await freetAPI.edit({ freet_id, message });
    return {};
  }

  onChange ( event ) {
    const message = event.target.value;
    this.setState({ message });
  }

  render () {
    return (
      <div>
        <MessageInput value={this.state.message}
                      onChange={this.onChange.bind(this)}/>
        <Link to='/'>Cancel</Link>
        <button onClick={this.onClick.bind(this)}>
          Apply
        </button>
      </div>
    )
  }
}

export default FreetEdit;