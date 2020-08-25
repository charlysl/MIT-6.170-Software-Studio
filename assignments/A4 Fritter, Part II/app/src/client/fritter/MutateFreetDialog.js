import React from 'react';

import freetAPI from '../api/freetAPI';

import MessageInput from '../fritter/MessageInput';


class MutateFreetDialog extends React.Component {

  constructor( props ) {
    super(props);
    this.state = {
      freet: props.freet
    };
  }

  async onClick () {
    const fields = this.state;
    await freetAPI[ props.onApply ]( fields );
    return {};
  }

  onChange () {
    const message = event.target.value;
    this.setState( (state) => {
      state.freet.message = message;
      return state;
    });
  }

  render () {
    return (
      <div>
        <h2>Edit Freet</h2>
        <MessageInput onChange={this.onChange.bind(this)}/>
        <button>Cancel</button>
        <button onClick={this.onClick.bind(this)}>
          Apply
        </button>
      </div>
    )
  }
}

export default MutateFreetDialog;