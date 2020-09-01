import React from 'react';

import {BrowserRouter as Router, Switch, Link, Route} from 'react-router-dom';

function Playpen () {
  return (
    <Router>
      <ul>
        <li>
          <Link to='/' >Home</Link>
        </li>
        <li>
          <Link to='/aa' >aa</Link>
        </li>
        <li>
          <Link to='/bb' >bb</Link>
        </li>
        <li>
          <Switch>
            <Route path='/aa'>
              <h2>aa</h2>
            </Route>
            <Route path='/bb'>
              <h2>bb</h2>
            </Route>
            <Route path='/'>
              <h2>Home</h2>
            </Route>
          </Switch>
        </li>
      </ul>
    </Router>
  );
}

export default Playpen;