import React from 'react';
import { Link } from 'react-router-dom';

function UserDoneEditName (props) {
  return (
    <div>
      <p>Changed user name to {props.username}</p>
      <ul>
        <li>
          <Link to="/">Continue</Link>
        </li>
      </ul>
    </div>
  )
}

export default UserDoneEditName;