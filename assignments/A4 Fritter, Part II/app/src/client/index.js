import React from 'react';
import ReactDOM from 'react-dom'


const minCredentialsLength = 1,
      maxFreetLength       = 140;

const Freet = function ( props ) {
  const freet = props.freet;
  return (
    <ul>
      <li>{freet.author}</li>
      <li>{freet.message}</li>
      <li>{freet.votes}</li>
      <li>
        <button>Edit</button>
      </li>
      <li>
        <button>Delete</button>
      </li>
      <li>
        <button>Upvote</button>
      </li>
      <li>
        <button>Downvote</button>
      </li>
    </ul>
  )
}

const Freets = function (props) {
  const freets = props.freets;

  const freetList = freets.map(( freet )=>{
    return <Freet freet={freet} />
  });

  return freetList;
}

const FreetSearch = function (props) {
  return (
    <ul>
      <li>
        <input type="text" name="author" placeholder="Search freets by author" />
      </li>
      <li>
        <label>
          Sort by votes
          <input type="checkbox" name="sort" />
        </label>
      </li>
    </ul>
  )
}

const NewSession = function (props) {
  return (
    <ul>
      <li>
        <button>Log In</button>
      </li>
      <li>
        <button>Sign Up</button>
      </li>
    </ul>
  )
}

const SessionManagement = function (props) {
  return (
    <ul>
      <li>
        <button>Change User Name</button>
      </li>
      <li>
        <button>Change User Password</button>
      </li>
      <li>
        <button>Logout</button>
      </li>
    </ul>
  )
}

const StartNewFreet = function (props) {
  return <button>Freet!</button>
}


const ConfirmationDialog = function (props) {

  // is there just one child, or more; put in an array.
  const children =  props.children instanceof Array ?
                    props.children :
                    [ props.children ];

  const childList = children.map(( child )=>{
    return <li>{child}</li>;
  });

  //TODO wrap in <dialog ...>?

  return (
    <ul>
      <li>
        <button>
          Cancel
        </button>
      </li>
      <li>
        <button>
          {props.apply}
        </button>
      </li>
      {childList}
    </ul>
  )
};


const NameInput = function (props) {
  const minlength = minCredentialsLength;

  return (
    <input  type       ="text"            name     ="name" 
            placeholder="Enter username"  minlength={minlength} />      
  )
}

const PasswordInput = function (props) {
  const minlength = minCredentialsLength;

  return (
    <input  type       ="password"       name     ="password" 
            placeholder="Enter password" minlength={minlength} />      
  )
}


const CredentialsDialog = function (props) {
  const minlength = minCredentialsLength;


  return (
    <ConfirmationDialog apply={props.apply}>
      <NameInput />
      <PasswordInput />
    </ConfirmationDialog>
  )
}

const NewUserDialog = function (props) {
  return (
    <CredentialsDialog apply="Sign Up" />
  )
}

const LoginDialog = function (props) {
  return (
    <CredentialsDialog apply="Sign In" />
  )
}

const NameChangeDialog = function (props) {
  return(
    <ConfirmationDialog apply="Change">
      <NameInput />
    </ConfirmationDialog>
  )
}

const PasswordChangeDialog = function (props) {
  return(
    <ConfirmationDialog apply="Change">
      <PasswordInput />
    </ConfirmationDialog>
  )
}

const MessageInput = function (props) {
  const maxlength = maxFreetLength,
        placeholder = "Enter message (at most " + maxlength + " characters";

  return (
    <input  type       ="text"            name     ="message" 
            placeholder={placeholder}     maxlength={maxlength} />      
  )
}

const NewFreetDialog = function (props) {
  return (
    <ConfirmationDialog apply="Freet">
      <MessageInput />
    </ConfirmationDialog>
  )
}

const DeleteConfirmation = function (props) {
  return (
    <ConfirmationDialog apply="Delete">
      <p>
        {props.text}
      </p>
    </ConfirmationDialog>
  )
}

const DeleteFreetConfirmation = function (props) {
  return (
    <DeleteConfirmation text="Are you sure you want to delete the Freet?" />
  )
}

const DeleteUserConfirmation = function (props) {
  return (
    <DeleteConfirmation text="Are you sure you want to delete your user?" />
  )
}

const Fritter = function (props) {
  return (
    <React.Fragment>
      <header>
        <FreetSearch />
        <NewSession />
        <SessionManagement />
      </header>
      <main>
        <Freets freets={props.freets} />
        <StartNewFreet />
        <NewUserDialog />
        <LoginDialog />
        <NameChangeDialog />
        <PasswordChangeDialog />
        <NewFreetDialog />
        <DeleteFreetConfirmation />
        <DeleteUserConfirmation />
      </main>
    </React.Fragment>
  )
}

const freet1 = {
  freet_id: 101,
  author: 'user1',
  message: "This is a message.",
  votes: 1
}


const freet2 = {
  freet_id: 102,
  author: 'user2',
  message: "This is another message.",
  votes: 2
}

const freets = [ freet1, freet2 ];

ReactDOM.render(<Fritter freets={freets} />, 
                document.querySelector('#root'));

