import React from 'react';
import { Redirect } from 'react-router-dom';

import ConfirmationDialog from './ConfirmationDialog.js';
import NameInput from './NameInput.js';
import PasswordInput from './PasswordInput.js';

import minCredentialsLength from './FritterConfig.js';

/**
* Credentials dialog React Component.
*
* Displays the following controls:
* - name text input box
* - password text input box
* - cancel button
* - apply button, which will invoke props.onApply when clicked.
*
* @param {string}   props.apply   - Apply button's label
* @param {Function} props.onApply - Apply button's callback, 
* which must be a Promise with signature:
* - @param {string} fields.name     - the name that was entered
* - @param {string} fields.password - the password that was entered
* - @returns {Object}   object.name     - the name that will be displayed
*                       object.password - the password that will be displayed
*                       object.error    - the error message to be displayed
*/
class CredentialsDialog extends React.Component {


  constructor (props) {
    super(props);

    const minlength = minCredentialsLength;

    this.state = {
      name:         '',
      password:     '',
      error:        '',
      redirect:     ''
    }
  }

  onChange ( name, value ) {
    this.setState({
      [name]: value
    })
  }

  async onApply () {
    const state = await this.props.onApply( this.state );
    console.log(this.state);
    
    this.setState( state );
  }

  render() {
    const redirect = this.state.redirect;

    if (redirect)
      return <Redirect to={redirect} />
    return (
      <ConfirmationDialog apply     = {this.props.apply} 
                          onApply   = {this.onApply.bind(this)}>
          <NameInput        name      = {this.state.name} 
                            error     = {this.state.error} 
                            onChange  = {this.onChange.bind(this)}/>

          <PasswordInput    password  = {this.state.password} 
                            onChange  = {this.onChange.bind(this)} />

      </ConfirmationDialog>
    )
  }
}

export default CredentialsDialog;
