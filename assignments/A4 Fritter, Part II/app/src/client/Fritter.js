import React from 'react';

import {
          BrowserRouter as Router, 
          Switch, 
          Route, 
          Link 
        } from 'react-router-dom';
import DebugRouter from './utils/DebugRouter';

import Home from './Home';

import UserCreate from './user/UserCreate';
import UserDoneCreate from './user/UserDoneCreate';
import UserDeleteConfirmation from './user/UserDeleteConfirmation';
import UserDelete from './user/UserDelete';
import UserEditName from './user/UserEditName';
import UserDoneEditName from './user/UserDoneEditName';


import Login from './session/Login';
import Logout from './session/Logout';

import EditFreetDialog from './fritter/EditFreetDialog';

class Fritter extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      username: ''
    };
  }

  onUsernameChanged ( username ) {
    console.log( 'fritter username: ' + username );
    this.setState( {username} );
  }

  onLogout() {
    this.setState( {username: ''});
  }

          // <Route path='/user/create-success' component={NewUserSuccess}/>
          // <Route path="/editfreet" exact={false} component={EditFreetDialog} />

  render () {
    return (
      <DebugRouter>
        <Switch>

          <Route  path='/user/create'      component={UserCreate}/>
          <Route  path='/user/done-create' component={UserDoneCreate}/>
          <Route  path='/user/delete-confirmation'>
            <UserDeleteConfirmation username={this.state.username} />
          </Route> 
          <Route  path='/user/delete'       component={UserDelete}/>
          <Route  path='/user/edit-name'>
            <UserEditName username={this.state.username} 
                          onChange={this.onUsernameChanged.bind(this)}/>
          </Route>
          <Route path='/user/done-edit-name'>
            <UserDoneEditName username={this.state.username} />
          </Route>

          <Route path='/session/login'>
            <Login onLogin={this.onUsernameChanged.bind(this)} />
          </Route>
          <Route path='/session/logout'>
            <Logout onLogout={this.onLogout.bind(this)} />
          </Route>


          <Route path='/'>
            <Home username={this.state.username} />
          </Route>
        </Switch>
      </DebugRouter>
    )
  }
}

export default Fritter;