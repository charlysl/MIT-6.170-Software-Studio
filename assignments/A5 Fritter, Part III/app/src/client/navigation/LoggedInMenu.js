import React from 'react';
import { Link } from 'react-router-dom';

import './LoggedInMenu.css';

function LoggedInMenu () {
  return (
    <ul className="LoggedInMenu">
      <li>
        <Link to='/user/edit-name'>Edit User Name</Link>
      </li>
      <li>
        <Link to='/user/edit-password'>Edit Password</Link>
      </li>
      <li>
        <Link to='/user/delete-confirmation'>Delete user account</Link>
      </li>
      <li>
        <Link to='/session/logout'>Log Out</Link>
      </li>
    </ul>
  )
}

export default LoggedInMenu;
