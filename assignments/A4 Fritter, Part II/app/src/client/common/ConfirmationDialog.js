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

  // TODO a wit wasteful to genearte the childlist for every render
  // is there just one child, or more; put in an array.
  const children =  props.children instanceof Array ?
                    props.children :
                    [ props.children ];

  const childList = children.map(( child )=>{
    return <li>{child}</li>;
  });

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
    <ul>
      {childList}
      <li>
        <button onClick={onCancel}>
          Cancel
        </button>
      </li>
      <li>
        {apply}
      </li>
    </ul>
  )
};

export default ConfirmationDialog;
