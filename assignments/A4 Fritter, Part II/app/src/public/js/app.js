/**
* public/app.js
*
* Fritter GUI
*
*/

//---------------------------------------------------------
//                  START CLIENT API
//---------------------------------------------------------

const client = {freet: {}, user: {}};

client.user.edit = function ( user ) {
  return axios.put( '/api/user', user );
}

client.user.delete = function () {
  return axios.delete( '/api/user' );
}

client.freet.create = function ( message ) {
  return axios.post( '/api/freet', {message} );
}

client.freet.search = function ( author ) {
  let query;
  if ( author ) {
    query = '?author=' + author;
  } else {
    query = '';
  }

  return axios.get( '/api/freet' + query )
}

client.freet.edit = function ( freet ) {
  return axios.put( '/api/freet/' + freet.freet_id, freet );
}

client.freet.delete = function ( freet_id ) {
  return axios.delete( '/api/freet/' + freet_id );
}

client.freet.upvote = function ( freet_id ) {
  return axios.post( '/api/freet/' + freet_id + '/vote', {direction:'up'});
}

client.freet.downvote = function ( freet_id ) {
  return axios.post( '/api/freet/' + freet_id + '/vote', {direction:'down'});
}

//---------------------------------------------------------
//                  END CLIENT API
//---------------------------------------------------------


const TextInput = function( props ) {
  return (
        <label>
          {props.label}:
          <input  type="text" 
                  name={props.name} 
                  value={props.value}
                  onChange={
                    (event)=>props.onChange( event.target.name, 
                                             event.target.value )
                  } 
          />
        </label>
  )
}

//----------------------------------------------------------------
//                START SESSION COMPONENTS  
//----------------------------------------------------------------

const Credentials = function( props ) {
  return (
    <div>
      <div>
        <TextInput  label="Username" 
                    name="name" 
                    value={props.name}
                    onChange={props.onChange} />
        <TextInput  label="Password"      
                    name="password" 
                    value={props.password}
                    onChange={props.onChange} />
      </div>
      <div>
        <button onClick={()=>props.onCreate()}>Create</button>
        <button onClick={()=>props.onEdit()}>Edit</button>
        <button onClick={()=>props.onDelete()}>Delete</button>
        {!props.isLoggedIn &&
        <button onClick={()=>props.onLogin()}>Login</button>
        }
        {props.isLoggedIn &&
        <button onClick={()=>props.onLogout()}>Logout</button>
        }
      </div>
    </div>
  );
}

/**
* Session management component
*
* Operations:
* - Create user
* - Sign in
* - Edit user
* - Delete user
* - Sing out
*
* @param username - the user's name
* @param password - the user's password
*/
class Session extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isLoggedIn: false, 
                  name: '', 
                  password: ''};
  }

  render() {
    return <Credentials name = {this.state.name}
                        password = {this.state.password}
                        isLoggedIn={this.state.isLoggedIn}
                        onChange={this.onChange.bind(this)} 
                        onCreate={this.onCreate.bind(this)}
                        onEdit={this.onEdit.bind(this)}
                        onDelete={this.onDelete.bind(this)}
                        onLogin={this.onLogin.bind(this)}
                        onLogout={this.onLogout.bind(this)}
           />;
  }

  onLoginSuccess() {
    this.setState(( state, props )=>{
      return {
        isLoggedIn: true
      }
    });
  }

  onLogoutSuccess() {
    this.setState(( state, props )=>{
      return { isLoggedIn: false }
    });
  }

  onChange( name, value ) {
    this.setState(( state, props )=>{
      return { [name]: value };
    });
  }

  onCreate() {
    console.log( this.state );
    axios
    .post('/api/user', this.state)
    .then(( res )=>{
    });
  }

  onEdit() {
    // prepare request fields
    let user = {};
    if ( this.state.name ) {
      user.name = this.state.name;
    }
    if ( this.state.password ) {
      user.password = this.state.password;
    }

    client.user.edit( user )
    .then(( res )=>{
      //TODO feedback
    });
  }

  /**
  * Delete the logged in user and logout.
  */
  onDelete() {
    client.user.delete()
    .then(( res )=>{
      if ( res.status === 204 ) {
        this.onLogout();
      }
    });
  }

  onLogin() {
    axios
    .post('/api/session/login', this.state )
    .then(( res )=>{
      if ( res.status === 204 ) {
        this.onLoginSuccess();
      }
    });
  }

  onLogout() {
    axios
    .delete('/api/session/logout')
    .then(( res )=>{
      if ( res.status === 204 )
        this.onLogoutSuccess();
    });
  }

}


//----------------------------------------------------------------
//                END SESSION COMPONENTS  
//----------------------------------------------------------------


//----------------------------------------------------------------
//                START FREETS COMPONENTS  
//----------------------------------------------------------------

const FreetCreate = function ( props ) {
  const freet = props;
  return (
    <div>
      <TextInput  label="Message"
                  name="message"
                  value={freet.message} 
                  onChange={freet.onChange}
      />
      <button onClick={props.onCreate}>
        Create
      </button>
    </div>
  )
}

const FreetSortCheckbox = function ( props ) {
  return (
    <input  type="checkbox" 
            name="sort" 
            checked={props.isSorted}
            onChange={props.onClick}
    />
  )
}

const FreetSearch = function ( props ) {
  return (
    <div>
      <h3>Freet Search</h3>
      <TextInput label="Author" name="author" onChange={props.onChange}/>
      <button onClick={props.onSearch}>Search</button>
      <label>
        Sort by votes
        <FreetSortCheckbox  isSorted={props.isSorted} 
                            onClick={props.onToggleSort}
        />
      </label>
    </div>
  )
}

const Freet = function ( props ) {
  const freet = props.freet;
  return (
    <div>
      <TextInput  label={'@' + freet.author_id} 
                  name="message"
                  value={freet.message} 
                  onChange={props.onFreetInput}
      />
      <span>{freet.votes}</span>
      <button onClick={props.onFreetEdit}>Edit</button>
      <button onClick={props.onFreetDelete}>Delete</button>
      <button onClick={props.onFreetUpvote}>Upvote</button>
      <button onClick={props.onFreetDownvote}>Downvote</button>
    </div>
  )
}

const FreetList = function ( props ) {

  // sort freet list by votes if required
  let freetList;
  if ( props.isSorted ) {
    freetList = Array.from( props.freetList );
    freetList.sort(( freet1, freet2 )=>{
      return freet1.votes < freet2.votes;
    });
  } else {  
    freetList = props.freetList;
  }

  return (
    <div>
      <h3>Freet List</h3>
      <ul>
      {freetList.map(( freet )=>{
        return  (
          <li key={freet.freet_id}>
            <Freet freet={freet}
                    onFreetInput={
                      ( name, value ) => {
                        props.onFreetInput( freet.freet_id,
                                            name,
                                            value
                        )
                      }
                    }
                  onFreetEdit={()=>{props.onFreetEdit(freet.freet_id)}}
                  onFreetUpvote={
                    ()=>{props.onFreetVote(freet.freet_id, true)}}
                  onFreetDownvote={
                    ()=>{props.onFreetVote(freet.freet_id, false)}}
                  onFreetDelete={()=>{props.onFreetDelete(freet.freet_id)}}
            />
          </li>
        )
      })}
      </ul>
    </div>
  )
}

class Freets extends React.Component {

  constructor ( props ) {
    super( props );
    this.state = {}
    this.state.freetList = [];
    this.state.isSorted = false;
  }

  render() {
    return (
      <div>
        <h2>Freets</h2>
        <FreetCreate  onChange={this.onChange.bind(this)}
                      onCreate={this.onCreate.bind(this)} 
        />
        <FreetSearch  isSorted={this.state.isSorted}
                      onChange={this.onChange.bind(this)} 
                      onSearch={this.onSearch.bind(this)}
                      onToggleSort={this.onToggleSort.bind(this)}
        />
        <FreetList  freetList={this.state.freetList} 
                    isSorted={this.state.isSorted}
                    onFreetInput={this.onFreetInput.bind(this)} 
                    onFreetEdit={this.onFreetEdit.bind(this)} 
                    onFreetVote={this.onFreetVote.bind(this)} 
                    onFreetDelete={this.onFreetDelete.bind(this)} 
        />
      </div>
    )
  }

  onChange( name, value ) {
    this.setState( { [name]: value } );
  }

  onCreate() {
    client.freet.create( this.state.message )
  }

  onSearch() {
    client.freet.search( this.state.author )
    .then(( res )=>{
      if ( res.status === 200 ) {
        this.setState({ freetList: res.data });
      } else if ( res.status === 204 ) {
        this.setState({ freetList: [] });
      } else {
        throw new Error('Unexpected status: ' + res.status );
      }
    });
  }

  onFreetInput ( freet_id, name, value ) {
    this.setState( ( state, props ) =>{
      const freet = this.getFreetById( state, freet_id );
      freet[ name ] = value;
      return {
        freetList: state.freetList
      }
    });
  }

  onFreetEdit( freet_id ) {
    const freet = this.getFreetById( this.state, freet_id );
    client.freet.edit( freet )
    .then(( res )=>{
      //TODO feedback
      console.log( res.status );
    });
  }

  onFreetDelete( freet_id ) {
    client.freet.delete( freet_id )
    .then(( res )=>{
      if ( res.status === 204 ) {
        this.removeFreetFromState( freet_id );
      }
    });
  }

  onFreetVote( freet_id, isUpvote ) {
    let promise;
    if (isUpvote) {
      promise = client.freet.upvote( freet_id );
    } else {
      promise = client.freet.downvote( freet_id );
    }

    promise.then(( res )=>{
      if ( res.status === 204 ) {
        this.voteFreetInState( freet_id, isUpvote );
      }
    });
  }

  onToggleSort() {
    this.setState(( state, props )=>{
      return {isSorted: !state.isSorted};
    });
  }

  getFreetById( state, freet_id ) {
    return state.freetList.find(( freet )=>{
      return freet.freet_id === freet_id;
    });    
  }

  removeFreetFromState( freet_id ) {
    this.setState( ( state, props )=>{
      //TODO this is very inneficient, but it works
      const freetList = state.freetList.filter(( freet )=>{
        return freet.freet_id !== freet_id;
      });
      return { freetList };
    });
  }

  voteFreetInState( freet_id, isUpvote ) {
    this.setState((state, props)=>{
      const freet = this.getFreetById( state, freet_id );
      freet.votes += isUpvote ? 1 : -1;
      return { freetList: state.freetList };
    });
  }

}

//----------------------------------------------------------------
//                END FREETS COMPONENTS  
//----------------------------------------------------------------

class App extends React.Component {

  constructor( props ) {
    super(props);
  }

  render() {
    return (
      <div>
        <header>
          <h1>Fritter</h1>
        </header>
        <nav>
          <Session />
        </nav>
        <main>
          <Freets />
        </main>
      </div>
    )
  }
}


ReactDOM.render(
  <App />,
  document.querySelector( '#root' )
);