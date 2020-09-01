import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import './Navigation.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


function Navigation (props) {

  const isLoggedIn = props.username !== ''; 

  let menuIcon = null;

  if (isLoggedIn) {

    let history = useHistory();

    if (props.isMenuDisplayed) {
      history.push("/menu");
    } else {
      // display previous route only if current route is the menu
      if (history.location.pathname === '/menu') {
        history.go(-1);
      }
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
    </nav>
  );
}



export default Navigation;
