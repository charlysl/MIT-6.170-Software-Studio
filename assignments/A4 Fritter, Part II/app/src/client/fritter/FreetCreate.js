import React from 'react';
import { Link } from 'react-router-dom';

import freetAPI from '../api/freetAPI';

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
    await freetAPI.create( fields );
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
          <Link to='/'>Cancel</Link>
          <button onClick={this.onClick.bind(this)}>
            Apply
          </button>
        </div>
      </div>
    )
  }
}

export default FreetCreate;