import React from 'react';

import { useHistory, Link } from 'react-router-dom';

/**
* Confirmation dialog abstract React Component
*
* @param {string}          apply    - apply button label
* @param {Function|string} onApply  - if Function   : apply button callback
*                                   - if string     : apply link
* @param {React.Component} children - component's children
*/
function ConfirmationDialog (props) {

  let history = useHistory();

  function onCancel () {
    history.go(-1);
  }

  //TODO wrap in <dialog ...>?


  let apply;
  if (typeof props.onApply === 'string') {
    apply = <Link to={props.onApply}>
              {props.apply}
            </Link>
  } else {
    apply = <button onClick={props.onApply}>
              {props.apply}
            </button>
  }

  return (
    <div className="Fritter-controls">
      <div className="Fritter-inputs">
        {props.children}
      </div>
      <div className="Fritter-buttons">
        <button onClick={onCancel}>
          Cancel
        </button>
        {apply}
      </div>
    </div>
  )
};

export default ConfirmationDialog;
