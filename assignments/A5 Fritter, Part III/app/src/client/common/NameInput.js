/**
*
* Module client/user/NameInput.js
*
*/

import React from 'react';

import {minCredentialsLength} from './FritterConfig.js';

/**
* React Component that displays a name's input box.
*
* @param {string}   name      - the name
* @param {string}   error     - error message (optional)
* @param {Function  (name)}   - name change callback (for inverse data flow)
*/
const NameInput = function (props) {
  const minlength = minCredentialsLength;

  return (
    <input  
      type        =   "text"
      name        =   "name"
      value       =   {props.name}
      placeholder =   {props.error || "Enter name" }
      minlength   =   {minlength} 
      onChange    =   {(e)=>{props.onChange(e.target.name,e.target.value)}} />
  )
}

export default NameInput;
