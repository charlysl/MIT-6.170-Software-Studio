import React from 'react';

import {
          BrowserRouter as Router, 
          Switch, 
          Route, 
          Link 
        } from 'react-router-dom';
import DebugRouter from './utils/DebugRouter';

import Navigation from './navigation/Navigation';
import LoggedInMenu  from './navigation/LoggedInMenu';

import Home from './Home';

import UserCreate from './user/UserCreate';
import UserDoneCreate from './user/UserDoneCreate';
import UserDeleteConfirmation from './user/UserDeleteConfirmation';
import UserDelete from './user/UserDelete';
import UserEditName from './user/UserEditName';
import UserDoneEditName from './user/UserDoneEditName';
import UserEditPassword from './user/UserEditPassword';
import UserDoneEditPassword from './user/UserDoneEditPassword';

import Login from './session/Login';
import Logout from './session/Logout';

import FreetCreate from './fritter/FreetCreate';
import FreetEdit from './fritter/FreetEdit';
import FreetDelete from './fritter/FreetDelete';

class Fritter extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      username: '',
      isMenuDisplayed: false,
      isSorted: false,
      freets: {
        unsorted: [],
        sorted: [],
      }
    };
  }

  onUsernameChanged ( username ) {
    console.log( 'fritter username: ' + username );
    this.setState( {username} );
  }

  onLogout() {
    this.setState( {username: '', isMenuDisplayed: false });
  }

  onMenu() {
    console.log('onMenu', this.state.isMenuDisplayed);
    this.setState(( state )=>{
      // toggle menu
      return { isMenuDisplayed: !state.isMenuDisplayed }
    });
  }


  onFreets ( freetList ) {
    console.log('onFreets', freetList);
    this.setState(( state ) => {
      // set new sorted and unsorted freets state
      const freets = {};
      freets.unsorted = freetList;
      freets.sorted = Array.from( freets.unsorted );
      freets.sorted.sort(( freet1, freet2 ) => {
        return freet1.votes < freet2.votes;
      });
      return { freets };
    });
  }

  onSorted ( event ) {
    console.log('Home.onSorted', event);

    const isSorted = event.target.checked;

    this.setState({ isSorted });
  }

  isLoggedIn () {
    return this.state.username !== '';
  }


          // <Route path='/user/create-success' component={NewUserSuccess}/>
          // <Route path="/editfreet" exact={false} component={EditFreetDialog} />

  render () {

    return (
      <DebugRouter>

        <Navigation username={this.state.username} 
                    onMenu={this.onMenu.bind(this)} 
                    isMenuDisplayed={this.state.isMenuDisplayed} />        

        <Switch>

          <Route  path='/menu'  component={LoggedInMenu} />

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
          <Route  path='/user/edit-password' component={UserEditPassword} />
          <Route  path='/user/done-edit-password' 
                  component={UserDoneEditPassword} />

          <Route path='/session/login'>
            <Login onLogin={this.onUsernameChanged.bind(this)} />
          </Route>
          <Route path='/session/logout'>
            <Logout onLogout={this.onLogout.bind(this)} />
          </Route>

          <Route path='/freet/create' component={FreetCreate} />
          <Route path='/freet/edit/:freet_id' component={FreetEdit} />
          <Route path='/freet/delete/:freet_id' component={FreetDelete} />

          <Route path='/'>
            <Home username={this.state.username} 
                  freets={this.state.isSorted ? 
                          this.state.freets.sorted   : 
                          this.state.freets.unsorted}  
                  isSorted={this.state.isSorted}
                  onFreets={this.onFreets.bind(this)} 
                  onSorted={this.onSorted.bind(this)}/>
          </Route>
        </Switch>
      </DebugRouter>
    )
  }
}

export default Fritter;