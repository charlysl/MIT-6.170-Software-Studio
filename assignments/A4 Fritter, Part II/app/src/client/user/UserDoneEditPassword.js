import React from 'react';
import { Link } from 'react-router-dom';

function UserDoneEditPassword (props) {
  return (
    <div>
      <p>Changed user password.</p>
      <ul>
        <li>
          <Link to="/">Continue</Link>
        </li>
      </ul>
    </div>
  )
}

export default UserDoneEditPassword;