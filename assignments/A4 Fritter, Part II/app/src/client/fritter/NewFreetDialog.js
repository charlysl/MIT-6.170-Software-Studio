import React from 'react';

import freetAPI from '../api/freetAPI';

import MessageInput from '../fritter/MessageInput';


class NewFreetDialog extends React.Component {

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
      <div>
        <MessageInput onChange={this.onChange.bind(this)}/>
        <button>Cancel</button>
        <button onClick={this.onClick.bind(this)}>
          Apply
        </button>
      </div>
    )
  }
}

export default NewFreetDialog;