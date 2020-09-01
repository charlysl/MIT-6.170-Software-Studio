import React from 'react';
import { Redirect } from 'react-router-dom';

import userAPI from '../api/userAPI';

import ConfirmationDialog from '../common/ConfirmationDialog.js';
import NameInput from '../common/NameInput.js';

import minCredentialsLength from '../common/FritterConfig.js';

/**
* Edit user name React Component.
*
* Displays the following controls:
* - name text input box
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
class UserEditName extends React.Component {

  constructor (props) {
    super(props);

    const minlength = minCredentialsLength;

    this.state = {
      name:         this.props.username,
      error:        '',
      redirect:     ''
    }

    this.props.apply = 'Change';
    this.props.onApply = async (state) => {
      try {
        await userAPI.edit( { name: state.name } );
        props.onUsernameChanged( state.name );
        return {
          redirect: '/user/done-edit-name'
        }
      } catch (err) {
        if (err.message.match(/DuplicateName/)) {
          return {
            err: 'Enter a different name'
          }
        } else {
          throw err;
        }
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

        <NameInput        name      = {this.state.name} 
                          error     = {this.state.error} 
                          onChange  = {this.onChange.bind(this)}/>

      </ConfirmationDialog>
    )
  }
}

export default UserEditName;
