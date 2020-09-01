import React from 'react';
import { Link } from 'react-router-dom';



function UserDoneCreate (props) {
  return (
    <div>
      <p>Created user {props.name}</p>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/session/login">Log In</Link>
        </li>
      </ul>
    </div>
  )
}

export default UserDoneCreate