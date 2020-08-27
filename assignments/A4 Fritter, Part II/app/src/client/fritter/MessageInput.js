import React from 'react';

import { maxFreetLength } from '../common/FritterConfig.js'

const MessageInput = function (props) {
  const placeholder = "Enter message (at most " 
                      + maxFreetLength + " characters";

  return (
    <textarea
      autofocus   = "true"
      cols        = "20" 
      maxlength   = {maxFreetLength}
      name        = "message"
      placeholder = {placeholder}     
      rows        = "10"
      spellcheck  = "true"
      value       = {props.value}
      wrap        = "soft"
      onChange    = {props.onChange}/>      
  )
}

export default MessageInput;