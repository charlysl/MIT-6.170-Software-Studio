import React from 'react';

import { useHistory } from 'react-router-dom';

function CancelButton (props) {

  const history = useHistory();

  function onCancel () {
    history.go(-1);
  }

  return (
    <button onClick={onCancel}>
      Cancel
    </button>    
  )  
}

export default CancelButton;
