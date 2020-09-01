import React from 'react';
import ReactDOM from 'react-dom'







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
      </li>
    </ul>
  )
}

const StartNewFreet = function (props) {
  return <button>Freet!</button>
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

// ReactDOM.render(<Fritter freets={freets} />, 
//                 document.querySelector('#root'));

