import React from 'react';

import Freet from './Freet.js';


const Freets = function (props) {
  const freets = props.freets;

  let freetList = freets.map(( freet )=>{
    return <Freet freet={freet} username={props.username} />
  });

  return freetList;
}

export default Freets;