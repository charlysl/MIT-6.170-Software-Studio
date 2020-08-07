fri = (function(){
  console.log('loaded fri');
  
  const domMap = {
    user_name_input: null,
    user_password_input: null,
    user_create_button: null
  };
  
  //------------- START DOM METHODS -----------------
  const initDomMap = function () {
    const root_el = document;

    // USER DOM ELEMENTS

    // user fields
    domMap.user_name_input = root_el.querySelector( '.user-name-input' );
    domMap.user_password_input = 
      root_el.querySelector( '.user-password-input' );

    // user buttons
    domMap.user_create_button = root_el.querySelector( 
      '.user-create-button' );
     domMap.session_login_button = root_el.querySelector( 
      '.session-login-button' );
     domMap.session_logout_button = root_el.querySelector( 
      '.session-logout-button' );

     // FREET DOM ELEMENTS

    // freet fields
    domMap.freet_id_input = 
      root_el.querySelector( '.freet-id-input' );
    domMap.freet_message_input = 
      root_el.querySelector( '.freet-message-input' );
    domMap.freet_author_input = 
      root_el.querySelector( '.freet-author-input' );

    // freet buttons
    domMap.freet_create_button = root_el.querySelector( 
      '.freet-create-button' );
  }
  
  const getUserFields = function () {
    const name = domMap.user_name_input.value;
    const password = domMap.user_password_input.value;
    return {
      name,
      password
    };
  }
  
  const showResponse = function ( response ) {
    console.log( response );
  }
  
  //------------- END DOM METHODS -----------------
  
  //------------- START EVENT HANDLERS -------------
  const onCreateUser = function () {
    const fields = getUserFields();
    axios.post( '/api/user', fields )
    .then( showResponse )
    .catch( showResponse );
  }

  const onLogin = function () {
    const fields = getUserFields();
    axios.post( '/api/session', fields )
    .then( showResponse )
    .catch( showResponse );
  }

  const onLogout = function () {
    axios.delete( '/api/session' )
    .then( showResponse )
    .catch( showResponse );
  }

 //------------- END EVENT HANDLERS -------------
  
  const initModule = function () {
    initDomMap();
    
    domMap.user_create_button.addEventListener( 'click', 
      onCreateUser );
    domMap.session_login_button.addEventListener( 'click', 
      onLogin );
    domMap.session_logout_button.addEventListener( 'click', 
      onLogout );
  }
  
  return {
    initModule  
  };
}());