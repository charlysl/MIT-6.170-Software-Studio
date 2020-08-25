import React from 'react';

import {minCredentialsLength} from './FritterConfig.js';

const PasswordInput = function (props) {
  const minlength = minCredentialsLength;

  return (
    <input  
      type        = "password"       
      name        = "password" 
      value       = {props.password}
      placeholder = "Enter password" 
      minlength   = {minlength}
      onChange    = {(e)=>{props.onChange(e.target.name,e.target.value)}} />

  )
}

export default PasswordInput;