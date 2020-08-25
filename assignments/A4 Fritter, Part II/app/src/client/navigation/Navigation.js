import React from 'react';

import LoggedInMenu  from './LoggedInMenu';
import LoggedOutMenu from './LoggedOutMenu';

function Navigation (props) {

  console.log('navigation', props);

  let navigation =  props.username    ?
                    <LoggedInMenu />  :
                    <LoggedOutMenu /> ;

  return navigation;
}

export default Navigation;
