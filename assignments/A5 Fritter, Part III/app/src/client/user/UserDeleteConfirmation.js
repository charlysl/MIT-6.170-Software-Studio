import React from 'react';

import ConfirmationDialog from '../common/ConfirmationDialog';

/**
* Confirm user deletion React Component.
*
* @param {string} The user's name
*/
function UserDeleteConfirmation (props) {

  return (
    <ConfirmationDialog apply='Delete' onApply='/user/delete'>
      <p>Are you sure you want to delete user {props.username}?</p>
      <p>After delete you will also be logged out</p>
    </ConfirmationDialog>
  )

}

export default UserDeleteConfirmation;
