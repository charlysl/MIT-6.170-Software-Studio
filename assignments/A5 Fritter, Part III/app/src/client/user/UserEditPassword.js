import React from 'react';
import { Redirect } from 'react-router-dom';

import userAPI from '../api/userAPI';

import ConfirmationDialog from '../common/ConfirmationDialog.js';
import PasswordInput from '../common/PasswordInput.js';

import minCredentialsLength from '../common/FritterConfig.js';

/**
* Edit user password React Component.
*
* Displays the following controls:
* - password text input box
* - cancel button
* - apply button, which will invoke props.onApply when clicked.
*
* @param {string}   props.apply   - Apply button's label
* @param {Function} props.onApply - Apply button's callback, 
* which must be a Promise with signature:
* - @param {string} fields.name     - the name that was entered
* - @returns {Object}   object.name     - the name that will be displayed
*                       object.error    - the error message to be displayed
*/
class UserEditPassword extends React.Component {

  constructor (props) {
    super(props);

    const minlength = minCredentialsLength;

    this.state = {
      password:     '',
      error:        '',
      redirect:     ''
    }

    this.props.apply = 'Change';
    this.props.onApply = async (state) => {
      try {
        await userAPI.edit( { password: state.password } );
        return {
          redirect: '/user/done-edit-password'
        }
      } catch (err) {
          throw err;  
      }
    }
  }

  onChange ( name, value ) {
    this.setState({
      [name]: value
    })
  }

  async onApply () {
    const state = await this.props.onApply( this.state );    
    this.setState( state );
  }

  render() {
    const redirect = this.state.redirect;

    if (redirect)
      return <Redirect to={redirect} />
    return (
      <ConfirmationDialog apply     = {this.props.apply} 
                          onApply   = {this.onApply.bind(this)}>

        <PasswordInput    password  = {this.state.password} 
                          error     = {this.state.error} 
                          onChange  = {this.onChange.bind(this)}/>

      </ConfirmationDialog>
    )
  }
}

export default UserEditPassword;
