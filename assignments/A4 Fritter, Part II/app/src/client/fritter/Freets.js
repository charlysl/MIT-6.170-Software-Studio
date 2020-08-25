import React from 'react';

import Freet from './Freet.js';


const Freets = function (props) {
  console.log('Freets', props);

  return  props.freets ? 
          getFreetList( props ) : 
          null
  ;
}

function getFreetList( props ) {
  return props.freets.map(( freet )=>{
    return <Freet freet={freet} username={props.username} />  
  })                                                          
}

export default Freets;