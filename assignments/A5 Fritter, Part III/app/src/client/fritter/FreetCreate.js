import React from 'react';
import { Link } from 'react-router-dom';

import freetAPI from '../api/freetAPI';

import CancelButton from '../common/CancelButton';
import MessageInput from '../fritter/MessageInput';

class FreetCreate extends React.Component {

  constructor( props ) {
    super(props);
    this.state = {
      message: ''
    };
  }

  async onClick () {
    const fields = this.state;
    const freet_id = await freetAPI.create( fields );
    fields.freet_id = freet_id;
    this.props.onFreetCreated( fields );
  }

  onChange () {
    const message = event.target.value;
    this.setState({
      message
    });
  }

  render () {
    return (
      <div className="Fritter-controls">
        <div className="Fritter-inputs">
          <MessageInput onChange={this.onChange.bind(this)}/>
        </div>
        <div className="Fritter-buttons">
          <CancelButton />
          <Link to="/">
            <button onClick={this.onClick.bind(this)}>
              Apply
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default FreetCreate;