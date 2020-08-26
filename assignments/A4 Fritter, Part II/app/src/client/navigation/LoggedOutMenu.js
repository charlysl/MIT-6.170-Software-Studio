import React from 'react';
import { Link } from 'react-router-dom';

import './LoggedOutMenu.css';

function LoggedOutMenu () {
  return (
    <div class="LoggedOutMenu">
        <Link to='/session/login'>Log In</Link>
        <Link to='/user/create'>Sign Up</Link>
    </div>
  );
}

export default LoggedOutMenu;