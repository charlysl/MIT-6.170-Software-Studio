import React from 'react';
import { Link } from 'react-router-dom';

function LoggedOutMenu () {
  return (
    <ul>
      <li>
        <Link to='/session/login'>Log In</Link>
      </li>
      <li>
        <Link to='/user/create'>Sign Up</Link>
      </li>
    </ul>
  );
}

export default LoggedOutMenu;