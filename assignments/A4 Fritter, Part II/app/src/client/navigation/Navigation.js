import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import './Navigation.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import LoggedOutMenu from './LoggedOutMenu';

function Navigation (props) {

  const isLoggedIn = props.username !== ''; 

  let navigation =  isLoggedIn        ?
                    null              :
                    <LoggedOutMenu /> ;


  let menuIcon = null;

  if (isLoggedIn) {

    let history = useHistory();
    if (props.isMenuDisplayed) {
      history.push("/menu");
    } else {
      history.go(-1);
    }

    let icon = props.isMenuDisplayed ? faTimes : faEllipsisV;

    menuIcon = (
        <FontAwesomeIcon  icon={icon} 
                          className="Navigation-menu-icon"
                          onClick={props.onMenu} />
    )
  }

  return (
    <nav className="Navigation">
      <h2 className="Navigation-home">
        <Link to="/">Fritter</Link>
        {menuIcon}
      </h2>

      {navigation}
    </nav>
  );
}

export default Navigation;
