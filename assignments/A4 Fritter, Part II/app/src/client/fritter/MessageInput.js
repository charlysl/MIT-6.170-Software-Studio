import React from 'react';

import maxFreetLength from '../common/FritterConfig.js'

const MessageInput = function (props) {
  const placeholder = "Enter message (at most " 
                      + maxFreetLength + " characters";

  return (
    <input  
      type        = "text"            
      name        = "message"
      value       = {props.value}
      placeholder = {placeholder}     
      maxlength   = {maxFreetLength} 
      onChange    = {props.onChange}/>      
  )
}

export default MessageInput;